const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const loginModel = require("../models/loginModel");

const JWT_SECRET = process.env.JWT_SECRET;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

exports.login = async (req, res) => {
  const schemaResult = loginSchema.safeParse(req.body);

  if (!schemaResult.success) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Missing or malformed login data",
        details: schemaResult.error.errors,
      })
    );
    return;
  }

  const user = schemaResult.data;

  try {
    const dbUser = await loginModel.getUserByEmail(user.email);
    if (!dbUser) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    const passwordCheck = await bcrypt.compare(user.password, dbUser.password);
    if (!passwordCheck) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Incorrect email/password" }));
      return;
    }

    const roles = await loginModel.getUserRoles(dbUser.id);

    const token = jwt.sign(
      { id: dbUser.id, email: dbUser.email, roles: roles },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Login successful", jwt: token }));
  } catch (error) {
    console.error("Error on user login: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
    return;
  }
};
