const { appointmentRoutes } = require("./appointmentRoutes");
const { registerRoutes } = require("./registerRoutes");

exports.routes = [...appointmentRoutes, ...registerRoutes];
