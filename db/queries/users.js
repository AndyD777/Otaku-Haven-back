import db from '../client.js';
import bcrypt from 'bcrypt';

export async function createUser({ username, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, is_admin`,
    [username, email, hashedPassword]
  );
  return result.rows[0];
}

export async function getUserByUsername(username) {
  const result = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  return result.rows[0];
}

export async function getUserById(id) {
  const result = await db.query(
    `SELECT id, username, email, is_admin FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function verifyUser(username, password) {
  const user = await getUserByUsername(username);
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  
  delete user.password;
  return user;
}

export async function updateUserById(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return getUserById(id); // nothing to update

  const setClause = keys.map((key, i) => `"${key}"=$${i + 1}`).join(', ');
  const values = Object.values(fields);

  const result = await db.query(
    `UPDATE users SET ${setClause} WHERE id=$${keys.length + 1} RETURNING id, username, email, is_admin`,
    [...values, id]
  );
  return result.rows[0];
}

export async function getAllUsers() {
  const result = await db.query('SELECT id, username, email, is_admin FROM users ORDER BY id');
  return result.rows;
}

export async function deleteUserById(id) {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
}
