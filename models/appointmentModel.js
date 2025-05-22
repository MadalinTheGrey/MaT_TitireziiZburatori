const { pool } = require("../db");

exports.checkAppointmentOverlap = async (date) => {
  const query = `
            SELECT EXISTS (
            SELECT 1 FROM appointments
            WHERE appointment_date > $1::timestamp - INTERVAL '59 minutes'
            AND appointment_date < $1::timestamp + INTERVAL '59 minutes'
            ) as "exists";
            `;

  const values = [date];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking appointment overlap: ", error);
    throw error;
  }
};

exports.addAppointment = async (appointment) => {
  const query = `
            INSERT INTO appointments
            (appointment_date, user_id, title, description)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
    `;
  const values = [
    appointment.appointment_date,
    appointment.user_id,
    appointment.title,
    appointment.description,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].id;
  } catch (error) {
    console.error("Error adding appointment: ", error);
    throw error;
  }
};

exports.addAppointmentFiles = async (appointment_id, appointmentFiles) => {
  const query = `
            INSERT INTO appointment_files
            (appointment_id, file_path)
            VALUES ($1, $2)
    `;
  try {
    for (const file of appointmentFiles) {
      await pool.query(query, [appointment_id, file]);
    }
  } catch (error) {
    console.error("Error adding appointment files: ", error);
    throw error;
  }
};
