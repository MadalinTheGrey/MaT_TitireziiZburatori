const { pool } = require("../db");

exports.addClientRole = async (id) => {
  const query = `
                INSERT INTO user_roles (user_id, role_id)
                values($1, 1);
                `;
  const values = [id];

  try {
    await pool.query(query, values);
    return;
  } catch (error) {
    console.error(
      "Error trying to check if user with given id exists: ",
      error
    );
    throw error;
  }
};
