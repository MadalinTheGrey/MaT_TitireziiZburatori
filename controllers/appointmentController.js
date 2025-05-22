const appointmentModel = require("../models/appointmentModel");

function isTimestamp(value) {
  if (typeof value !== "string") return false;

  const iso8601 = value.replace(" ", "T");
  const date = new Date(iso8601);

  return !isNaN(date.getTime()) && iso8601.length >= 19;
}

exports.addAppointment = async (req, res) => {
  const appointment = req.body;

  if (
    !appointment ||
    appointment.appointment_date === undefined ||
    appointment.user_id === undefined ||
    appointment.title === undefined ||
    appointment.description === undefined ||
    !Number.isInteger(appointment.user_id) ||
    !isTimestamp(appointment.appointment_date)
  ) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "Missing or malformed data for appointment" })
    );
  }
};
