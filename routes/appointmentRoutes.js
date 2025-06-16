const appointmentController = require("../controllers/appointmentController");
const { verifyToken } = require("../middleware/authMiddleware");

exports.appointmentRoutes = [
  {
    method: "POST",
    path: "/api/appointments",
    middleware: [verifyToken(["client"])],
    handler: appointmentController.addAppointment,
  },
];
