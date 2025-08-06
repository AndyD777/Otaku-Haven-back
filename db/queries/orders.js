import db from '../db/client.js';

export async function createOrder(userId, cartItems) {
  // Start transaction
  try {
    await db.query('BEGIN');

    const orderRes = await db.query(
      `INSERT INTO orders (user_id, status) VALUES ($1, 'pending') RETURNING *`,
      [userId]
    );
    const order = orderRes.rows[0];

    // Insert order_products
    for (const item of cartItems) {
      await db.query(
        `INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [order.id, item.product_id, item.quantity]
      );
    }

    // Clear cart
    await db.query(
      `DELETE FROM cart WHERE user_id = $1`,
      [userId]
    );

    await db.query('COMMIT');
    return order;
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  }
}

export async function getOrdersByUserId(userId) {
  const ordersRes = await db.query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return ordersRes.rows;
}

export async function getOrderDetails(orderId) {
  const orderRes = await db.query(
    `SELECT * FROM orders WHERE id = $1`,
    [orderId]
  );
  const productsRes = await db.query(
    `SELECT op.product_id, p.name, p.price, op.quantity
     FROM order_products op
     JOIN products p ON op.product_id = p.id
     WHERE op.order_id = $1`,
    [orderId]
  );
  return { order: orderRes.rows[0], products: productsRes.rows };
}
