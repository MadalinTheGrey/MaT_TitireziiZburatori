const { appointmentRoutes } = require("./appointmentRoutes");
const { registerRoutes } = require("./registerRoutes");
const { loginRoutes } = require("./loginRoutes");
const { supplyRoutes } = require("./supplyRoutes");
const { orderRoutes } = require("./orderRoutes");

exports.routes = [
  ...appointmentRoutes,
  ...registerRoutes,
  ...loginRoutes,
  ...supplyRoutes,
  ...orderRoutes,
];
