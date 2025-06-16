const { appointmentRoutes } = require("./appointmentRoutes");
const { registerRoutes } = require("./registerRoutes");
const { loginRoutes } = require("./loginRoutes");

exports.routes = [...appointmentRoutes, ...registerRoutes, ...loginRoutes];
