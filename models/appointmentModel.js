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

exports.addAppointmentFile = async (appointment_id, appointmentFile) => {
  const query = `
            INSERT INTO appointment_files
            (appointment_id, file_path)
            VALUES ($1, $2)
    `;
  try {
    await pool.query(query, [appointment_id, appointmentFile]);
  } catch (error) {
    console.error("Error adding appointment files: ", error);
    throw error;
  }
};

exports.checkAppointmentIdValidity = async (appointmentId, userId) => {
  const query = `
              SELECT EXISTS (
              SELECT 1 FROM appointments WHERE id = $1 AND user_id = $2
              ) AS "exists";
              `;
  const values = [appointmentId, userId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking appointment id validity: ", error);
    throw error;
  }
};

exports.getAppointmentById = async (appointmentId, userId, isAdmin) => {
  let query = `
              SELECT id, appointment_date, user_id, title, description, is_approved, admin_review
              FROM appointments
              WHERE id = $1
              `;
  const values = [appointmentId];

  if (!isAdmin) {
    query += ` AND user_id = $2`;
    values.push(userId);
  }

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error getting appointment by id: ", error);
    throw error;
  }
};

exports.getAppointmentFiles = async (appointmentId) => {
  const query = `
              SELECT file_path FROM appointment_files
              WHERE appointment_id = $1
              `;
  const values = [appointmentId];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching appointment files");
  }
};

exports.getAppointmentsByUserId = async (userId) => {
  const query = `
              SELECT 
              a.id AS appointment_id,
              a.appointment_date,
              a.user_id,
              a.title,
              a.description,
              a.is_approved,
              a.admin_review,
              f.file_path
              FROM appointments a
              LEFT JOIN appointment_files f ON a.id = f.appointment_id
              WHERE a.user_id = $1
              ORDER BY a.id;
              `;
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching appointments by user id: ", error);
    throw error;
  }
};

exports.getAppointmentsFiltered = async (filters) => {
  let query = `
                SELECT
                a.id AS appointment_id,
                a.appointment_date,
                a.user_id,
                a.title,
                a.description,
                a.is_approved,
                a.admin_review,
                f.file_path
                FROM appointments a
                LEFT JOIN appointment_files f ON a.id = f.appointment_id
                `;
  const values = [];
  if (filters.is_approved) {
    query += ` WHERE a.is_approved = $1`;
    values.push(filters.is_approved.toUpperCase());
  }
  query += ` ORDER BY a.appointment_date ASC`;

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching filtered appointments: ", error);
    throw error;
  }
};

exports.updateAppointmentWithReview = async (review, appointmentId) => {
  const query = `
              UPDATE appointments
              SET is_approved = $1,
                  admin_review = $2
              WHERE id = $3
              `;
  const values = [review.is_approved, review.admin_review, appointmentId];

  try {
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error updating appointment with review: ", error);
    throw error;
  }
};
