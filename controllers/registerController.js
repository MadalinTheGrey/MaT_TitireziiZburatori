const registerModel = require("../models/registerModel");
const roleModel = require("../models/roleModel");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(1),
});

exports.createUser = async (req, res) => {
  const schemaResult = registerSchema.safeParse(req.body);

  if (!schemaResult.success) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Missing or malformed data for user",
        details: schemaResult.error.errors,
      })
    );
    return;
  }
  let user = schemaResult.data;
  user.email = user.email.toLowerCase();
  try {
    const existsEmail = await registerModel.existsEmail(user.email);
    if (existsEmail) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Provided email is already in use" }));
      return;
    }
  } catch (error) {
    console.error("Error trying to validate email: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
    return;
  }

  const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS);
  const newUser = {
    username: user.username,
    passwordHash: passwordHash,
    email: user.email,
  };

  try {
    const userId = await registerModel.createUser(newUser);
    //new users get the client role by default
    await roleModel.addClientRole(userId);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id: userId }));
  } catch (error) {
    console.error("Error creating user: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};
