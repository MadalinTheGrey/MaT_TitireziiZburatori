const loginController = require("../controllers/loginController");

exports.loginRoutes = [
  {
    method: "POST",
    path: "/api/login",
    handler: loginController.login,
  },
];
