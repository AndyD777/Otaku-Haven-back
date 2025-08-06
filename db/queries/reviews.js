import db from '../db/client.js';

export async function getReviewsByProductId(productId) {
  const result = await db.query(
    `SELECT r.id, r.rating, r.comment, r.created_at, u.username
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
    [productId]
  );
  return result.rows;
}

export async function addReview(userId, productId, rating, comment) {
  const result = await db.query(
    `INSERT INTO reviews (user_id, product_id, rating, comment) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, productId, rating, comment]
  );
  return result.rows[0];
}
