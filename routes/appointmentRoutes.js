const appointmentController = require("../controllers/appointmentController");

exports.appointmentRoutes = [
  {
    method: "POST",
    path: "/api/appointment",
    handler: appointmentController.addAppointment,
  },
];
