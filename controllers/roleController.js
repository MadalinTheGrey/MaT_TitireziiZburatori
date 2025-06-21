const roleModel = require("../models/roleModel");
const { z } = require("zod");

const roleSchema = z.object({
  user_id: z.number().int().min(1),
  role_id: z.number().int().min(1),
});

exports.addRole = async (req, res) => {
  const schemaResult = roleSchema.safeParse(req.body);

  if (!schemaResult.success) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing or malformed role data" }));
    return;
  }

  const userRolePair = schemaResult.data;

  try {
    const existsUser = await roleModel.existsUserId(userRolePair.user_id);
    if (!existsUser) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    const existsRole = await roleModel.existsRoleId(userRolePair.role_id);
    if (!existsRole) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Role not found" }));
      return;
    }

    const existsRelation = await roleModel.userRoleRelationExists(
      userRolePair.user_id,
      userRolePair.role_id
    );
    if (existsRelation) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User already has that role" }));
      return;
    }

    const addedRole = await roleModel.addRole(
      userRolePair.user_id,
      userRolePair.role_id
    );
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: `Added role with id ${addedRole.role_id} to user with id ${addedRole.user_id}`,
      })
    );
  } catch (error) {
    console.error("Error adding role to user: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};
