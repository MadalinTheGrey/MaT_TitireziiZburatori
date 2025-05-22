const registerModel = require("../models/registerModel");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

function isValidEmail(email) {
  if (typeof email !== "string") return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (!domain.includes(".")) return false;

  const domainParts = domain.split(".");
  if (domainParts.some((part) => part.length === 0)) return false;

  return true;
}

exports.createUser = async (req, res) => {
  const user = req.body;

  if (
    !user ||
    user.username === undefined ||
    user.password === undefined ||
    user.email === undefined ||
    typeof user.username !== "string" ||
    typeof user.password !== "string" ||
    !isValidEmail(user.email)
  ) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing or malformed data for user" }));
    return;
  }

  try {
    const existsEmail = await registerModel.checkEmailDuplicate(user.email);
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
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id: userId }));
  } catch (error) {
    console.error("Error creating user: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};
