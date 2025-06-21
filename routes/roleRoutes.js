const roleController = require("../controllers/roleController");
const { verifyToken } = require("../middleware/authMiddleware");
const adminRole = "admin";

exports.roleRoutes = [
  {
    method: "POST",
    path: "/api/roles",
    middleware: [verifyToken([adminRole])],
    handler: roleController.addRole,
  },
];
