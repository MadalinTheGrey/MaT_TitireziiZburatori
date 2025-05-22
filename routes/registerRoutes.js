const registerController = require("../controllers/registerController");

exports.registerRoutes = [
  {
    method: "POST",
    path: "/api/register",
    handler: registerController.createUser,
  },
];
