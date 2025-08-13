import db from '../client.js';

export async function getAllProducts() {
  const result = await db.query('SELECT * FROM products ORDER BY id');
  return result.rows;
}

export async function getProductById(id) {
  const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
}

export async function createProduct({ name, description, price, image }) {
  const result = await db.query(
    `INSERT INTO products (name, description, price, image)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, description, price, image]
  );
  return result.rows[0];
}

export async function updateProduct(id, { name, description, price, image }) {
  const result = await db.query(
    `UPDATE products SET name=$1, description=$2, price=$3, image=$4 WHERE id=$5 RETURNING *`,
    [name, description, price, image, id]
  );
  return result.rows[0];
}

export async function deleteProduct(id) {
  await db.query('DELETE FROM products WHERE id=$1', [id]);
}
