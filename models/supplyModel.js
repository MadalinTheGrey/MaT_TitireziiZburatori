const { pool } = require("../db");

exports.addSupply = async (supply) => {
  const query = `
                INSERT INTO supplies
                (name, description, in_stock)
                VALUES($1, $2, $3)
                RETURNING id;
                `;
  const values = [supply.name, supply.description, supply.in_stock];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].id;
  } catch (error) {
    console.error("Error adding supply: ", error);
    throw error;
  }
};

exports.updateSupplyStock = async (supplyStock, supplyId) => {
  const query = `
                UPDATE supplies
                SET in_stock = $1
                WHERE id = $2
                `;
  const values = [supplyStock, supplyId];

  try {
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error updating supply stock: ", error);
    throw error;
  }
};

exports.getSupplies = async (filters) => {
  let query = `
            SELECT id, name, description, in_stock
            FROM supplies
            `;
  const values = [];

  if (filters.name) {
    query += ` WHERE name = $1`;
    values.push(filters.name);
  }
  if (filters.in_stock != null) {
    if (!values.length) {
      query += ` WHERE in_stock = $1`;
    } else {
      query += ` AND in_stock = ${values.length + 1}`;
    }
    values.push(filters.in_stock);
  }

  query += ` ORDER BY name`;

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error getting supplies: ", error);
    throw error;
  }
};
