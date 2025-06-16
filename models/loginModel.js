const { pool } = require("../db");

exports.getUserByEmail = async (email) => {
  const query = `
                SELECT id, username, email, password FROM users
                WHERE email = $1;
                `;
  const values = [email];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error getting user by email: ", error);
    throw error;
  }
};

exports.getUserRoles = async (id) => {
  const query = `
              SELECT r.name
              FROM roles r
              JOIN user_roles ur ON r.id = ur.role_id
              WHERE ur.user_id = $1
              `;
  const values = [id];
  try {
    const result = await pool.query(query, values);
    return result.rows.map((row) => row.name);
  } catch (error) {
    console.error("Error getting user roles: ", error);
    throw error;
  }
};
