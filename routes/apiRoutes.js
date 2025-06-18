const { appointmentRoutes } = require("./appointmentRoutes");
const { registerRoutes } = require("./registerRoutes");
const { loginRoutes } = require("./loginRoutes");
const { supplyRoutes } = require("./supplyRoutes");

exports.routes = [
  ...appointmentRoutes,
  ...registerRoutes,
  ...loginRoutes,
  ...supplyRoutes,
];
