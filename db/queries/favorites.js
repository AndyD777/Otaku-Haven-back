import db from '../db/client.js';

export async function getFavoritesByUserId(userId) {
  const result = await db.query(
    `SELECT f.product_id, p.name, p.price, p.image
     FROM favorites AS f
     JOIN products AS p ON f.product_id = p.id
     WHERE f.user_id = $1`,
    [userId]
  );
  return result.rows;
}

export async function addFavorite(userId, productId) {
  const existing = await db.query(
    `SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2`,
    [userId, productId]
  );
  if (existing.rows.length) return null; // already favorited

  const inserted = await db.query(
    `INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *`,
    [userId, productId]
  );
  return inserted.rows[0];
}

export async function removeFavorite(userId, productId) {
  await db.query(
    `DELETE FROM favorites WHERE user_id = $1 AND product_id = $2`,
    [userId, productId]
  );
}
