import db from '../client.js';

export async function getFavoritesByUserId(userId) {
  const result = await db.query(`
    SELECT favorites.id, products.*
    FROM favorites
    JOIN products ON favorites.product_id = products.id
    WHERE favorites.user_id = $1
  `, [userId]);
  return result.rows;
}

export async function addFavorite(userId, productId) {
  const result = await db.query(
    `INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`,
    [userId, productId]
  );
  return result.rows[0];
}

export async function removeFavorite(userId, productId) {
  await db.query(
    `DELETE FROM favorites WHERE user_id=$1 AND product_id=$2`,
    [userId, productId]
  );
}

