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

exports.existsUserId = async (id) => {
  const query = `
              SELECT EXISTS (
                SELECT 1 FROM users WHERE id = $1
              ) AS "exists"
              `;
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking if user with given id exists: ", error);
    throw error;
  }
};

exports.existsRoleId = async (id) => {
  const query = `
              SELECT EXISTS (
                SELECT 1 FROM roles WHERE id = $1
              ) AS "exists"
              `;
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking if role with given id exists: ", error);
    throw error;
  }
};

exports.userRoleRelationExists = async (userId, roleId) => {
  const query = `
              SELECT EXISTS (
                SELECT 1 FROM user_roles
                WHERE user_id = $1 AND role_id = $2
              ) AS "exists"
              `;
  const values = [userId, roleId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking if user already has role: ", error);
    throw error;
  }
};

exports.addRole = async (userId, roleId) => {
  const query = `
              INSERT INTO user_roles (user_id, role_id)
              VALUES($1, $2)
              RETURNING user_id, role_id
              `;
  const values = [userId, roleId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding role to user: ", error);
    throw error;
  }
};
