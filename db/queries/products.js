import db from '../db/client.js';

export async function getAllProducts() {
  const result = await db.query('SELECT * FROM products');
  return result.rows;
}