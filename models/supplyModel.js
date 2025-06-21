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
      query += ` WHERE in_stock <= $1`;
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

exports.existsSupply = async (id) => {
  const query = `
              SELECT EXISTS (
                SELECT 1 FROM supplies WHERE id = $1
              ) AS "exists";
              `;
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking supply existence: ", error);
    throw error;
  }
};

exports.importSupplies = async (supplies) => {
  const values = [];
  const valuePlaceholders = supplies
    .map((supply, index) => {
      const valueIndex = index * 3;
      values.push(supply.name, supply.description, supply.in_stock);
      return `($${valueIndex + 1}, $${valueIndex + 2}, $${valueIndex + 3})`;
    })
    .join(", ");

  const query = `
              INSERT INTO supplies (name, description, in_stock)
              VALUES ${valuePlaceholders};
              `;
  try {
    const result = await pool.query(query, values);
    return result.rowCount;
  } catch (error) {
    console.error("Error importing supplies: ", error);
    throw error;
  }
};
