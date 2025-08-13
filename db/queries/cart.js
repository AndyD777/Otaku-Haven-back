import db from '../client.js';

export async function getCartItemsByUserId(userId) {
  const result = await db.query(`
    SELECT cart.id, cart.quantity, products.*
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = $1
  `, [userId]);
  return result.rows;
}

export async function addToCart(userId, productId, quantity = 1) {
  // Updates quantity first
  const existing = await db.query(
    `SELECT * FROM cart WHERE user_id=$1 AND product_id=$2`,
    [userId, productId]
  );

  if (existing.rows.length) {
    const newQty = existing.rows[0].quantity + quantity;
    const updated = await db.query(
      `UPDATE cart SET quantity=$1 WHERE user_id=$2 AND product_id=$3 RETURNING *`,
      [newQty, userId, productId]
    );
    return updated.rows[0];
  } else {
    const inserted = await db.query(
      `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
      [userId, productId, quantity]
    );
    return inserted.rows[0];
  }
}

export async function updateCartItem(userId, productId, quantity) {
  if (quantity <= 0) {
    return removeCartItem(userId, productId);
  }
  const result = await db.query(
    `UPDATE cart SET quantity=$1 WHERE user_id=$2 AND product_id=$3 RETURNING *`,
    [quantity, userId, productId]
  );
  return result.rows[0];
}

export async function removeCartItem(userId, productId) {
  await db.query(
    `DELETE FROM cart WHERE user_id=$1 AND product_id=$2`,
    [userId, productId]
  );
}
