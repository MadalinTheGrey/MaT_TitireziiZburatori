const { pool } = require("../db");

exports.addOrder = async (order) => {
  const query = `
                INSERT INTO orders (supply_id, provider, description)
                VALUES($1, $2, $3)
                RETURNING id;
                `;
  const values = [order.supply_id, order.provider, order.description];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].id;
  } catch (error) {
    console.error("Error adding order: ", error);
    throw error;
  }
};

exports.getOrders = async () => {
  const query = `
                SELECT
                o.id,
                o.supply_id,
                s.name AS supply_name,
                o.provider,
                o.description
                FROM orders o
                JOIN supplies s on s.id = o.supply_id
                ORDER BY s.name
                `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error getting orders: ", error);
    throw error;
  }
};

exports.deleteOrder = async (orderId) => {
  const query = `
                DELETE FROM orders
                WHERE id = $1
                `;
  const values = [orderId];

  try {
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error deleting order: ", error);
    throw error;
  }
};
