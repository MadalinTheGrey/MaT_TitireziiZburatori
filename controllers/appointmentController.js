const appointmentModel = require("../models/appointmentModel");

function isTimestamp(value) {
  if (typeof value !== "string") return false;

  const iso8601 = value.replace(" ", "T");
  const date = new Date(iso8601);

  return !isNaN(date.getTime()) && iso8601.length >= 19;
}

exports.addAppointment = async (req, res) => {
  const appointment = req.body;

  //TODO check that user is logged in
  if (
    !appointment ||
    appointment.appointment_date === undefined ||
    appointment.user_id === undefined ||
    appointment.title === undefined ||
    appointment.description === undefined ||
    !Number.isInteger(appointment.user_id) ||
    !isTimestamp(appointment.appointment_date) ||
    typeof appointment.title !== "string" ||
    typeof appointment.description !== "string"
  ) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "Missing or malformed data for appointment" })
    );
    return;
  }

  // TODO: check that user with given id exists - will use info from jwt after defining
  try {
    const overlap = await appointmentModel.checkAppointmentOverlap(
      appointment.appointment_date
    );
    if (overlap) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Appointment time overlaps with other existing ones",
        })
      );
      return;
    }

    const appointmentId = await appointmentModel.addAppointment(appointment);

    // TODO: handle uploaded files and call addAppointmentFiles once implemented - might do this in a different file

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ id: appointmentId }));
  } catch (error) {
    console.error("Error adding equipment: ", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
};
