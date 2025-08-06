import db from './client.js'; 

async function seed() {
  try {
    await db.query(`
      DROP TABLE IF EXISTS products;
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price INTEGER,
        image TEXT
      );
    `);

    await db.query(`
      INSERT INTO products (name, description, price, image)
      VALUES 
        ('Ichigo Figure', 'Bankai form Ichigo Kurosaki', 4999, '/images/ichigo.jpg'),
        ('Sasuke Figure', 'Eternal Mangekyō Sharingan Sasuke', 5999, '/images/sasuke.jpg');
    `);

    console.log("🌱 Seed complete");
  } catch (err) {
    console.error("❌ Seed failed", err);
  } finally {
    db.end();
  }
}

seed();
