const appointmentController = require("../controllers/appointmentController");
const { verifyToken } = require("../middleware/authMiddleware");
const clientRole = "client";
const adminRole = "admin";

exports.appointmentRoutes = [
  {
    method: "POST",
    path: "/api/appointments",
    middleware: [verifyToken([clientRole])],
    handler: appointmentController.addAppointment,
  },
  {
    method: "POST",
    path: "/api/appointments/:id/files",
    middleware: [verifyToken([clientRole])],
    handler: appointmentController.uploadAppointmentFiles,
  },
  {
    method: "GET",
    path: "/api/appointments/:id",
    middleware: [verifyToken([clientRole])],
    handler: appointmentController.getAppointmentById,
  },
  {
    method: "GET",
    path: "/api/appointments",
    middleware: [verifyToken([clientRole])],
    handler: appointmentController.getAppointments,
  },
];
