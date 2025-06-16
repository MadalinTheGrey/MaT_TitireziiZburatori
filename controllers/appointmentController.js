const appointmentModel = require("../models/appointmentModel");
const { z } = require("zod");

function isTimestamp(value) {
  const iso8601 = value.replace(" ", "T");
  const date = new Date(iso8601);

  return !isNaN(date.getTime()) && iso8601.length >= 19;
}

const appointmentSchema = z.object({
  title: z.string().min(1),
  appointment_date: z.string().refine(isTimestamp, {
    message: "Invalid appointment date",
  }),
  description: z.string().min(1),
});

exports.addAppointment = async (req, res) => {
  const schemaResult = appointmentSchema.safeParse(req.body);
  if (!schemaResult.success) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Missing or malformed data for appointment",
        details: schemaResult.error.errors,
      })
    );
    return;
  }

  const appointment = {
    ...schemaResult.data,
    user_id: req.user.id,
  };

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
