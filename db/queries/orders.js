import db from '../client.js';

export async function getOrdersByUserId(userId) {
  const result = await db.query(
    `SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function createOrder(userId) {
  const result = await db.query(
    `INSERT INTO orders (user_id) VALUES ($1) RETURNING *`,
    [userId]
  );
  return result.rows[0];
}

export async function getOrderById(id) {
  const result = await db.query(
    `SELECT * FROM orders WHERE id=$1`,
    [id]
  );
  return result.rows[0];
}

export async function updateOrderStatus(id, status) {
  const result = await db.query(
    `UPDATE orders SET status=$1 WHERE id=$2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}
