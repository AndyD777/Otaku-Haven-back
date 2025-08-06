import db from '../db/client.js';

export async function getCartItemsByUserId(userId) {
  const result = await db.query(
    `SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image
     FROM cart AS c
     JOIN products AS p ON c.product_id = p.id
     WHERE c.user_id = $1`,
    [userId]
  );
  return result.rows;
}

export async function addItemToCart(userId, productId, quantity) {
  // Check if product already in cart
  const existing = await db.query(
    `SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2`,
    [userId, productId]
  );

  if (existing.rows.length) {
    // Update quantity
    const newQuantity = existing.rows[0].quantity + quantity;
    const updated = await db.query(
      `UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *`,
      [newQuantity, existing.rows[0].id]
    );
    return updated.rows[0];
  } else {
    // Insert new
    const inserted = await db.query(
      `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
      [userId, productId, quantity]
    );
    return inserted.rows[0];
  }
}

export async function removeItemFromCart(userId, productId) {
  await db.query(
    `DELETE FROM cart WHERE user_id = $1 AND product_id = $2`,
    [userId, productId]
  );
}

export async function clearCart(userId) {
  await db.query(
    `DELETE FROM cart WHERE user_id = $1`,
    [userId]
  );
}
