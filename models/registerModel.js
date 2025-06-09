const { pool } = require("../db");

exports.existsEmail = async (email) => {
  const query = `
              SELECT EXISTS (
              SELECT 1 FROM users WHERE email = $1
              ) as "exists";
              `;

  const values = [email];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking for duplicate email: ", error);
    throw error;
  }
};

exports.createUser = async (user) => {
  const query = `
            INSERT INTO users
            (username, password, email)
            VALUES ($1, $2, $3)
            RETURNING id;
    `;

  const values = [user.username, user.passwordHash, user.email];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].id;
  } catch (error) {
    console.error("Error creating user: ", error);
    throw error;
  }
};
