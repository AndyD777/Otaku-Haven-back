import db from '../client.js';

export async function getReviewsByProductId(productId) {
  const result = await db.query(
    `SELECT reviews.*, users.username FROM reviews JOIN users ON reviews.user_id = users.id WHERE product_id=$1 ORDER BY created_at DESC`,
    [productId]
  );
  return result.rows;
}

export async function addReview({ userId, productId, rating, comment }) {
  const result = await db.query(
    `INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, productId, rating, comment]
  );
  return result.rows[0];
}

export async function updateReview(id, { rating, comment }) {
  const result = await db.query(
    `UPDATE reviews SET rating=$1, comment=$2 WHERE id=$3 RETURNING *`,
    [rating, comment, id]
  );
  return result.rows[0];
}

export async function deleteReview(id) {
  await db.query(
    `DELETE FROM reviews WHERE id=$1`,
    [id]
  );
}
