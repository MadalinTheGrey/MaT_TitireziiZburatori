const { appointmentRoutes } = require("./appointmentRoutes");
const { registerRoutes } = require("./registerRoutes");
const { loginRoutes } = require("./loginRoutes");
const { supplyRoutes } = require("./supplyRoutes");
const { orderRoutes } = require("./orderRoutes");
const { roleRoutes } = require("./roleRoutes");

exports.routes = [
  ...appointmentRoutes,
  ...registerRoutes,
  ...loginRoutes,
  ...supplyRoutes,
  ...orderRoutes,
  ...roleRoutes,
];
