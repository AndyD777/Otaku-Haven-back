import pkg from 'pg';
const { Pool } = pkg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/otaku_haven'
});

export default db;
