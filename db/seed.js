import db from './client.js';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    // Drop and recreate tables
    await db.query(`
      DROP TABLE IF EXISTS cart;
      DROP TABLE IF EXISTS favorites;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS products;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT false
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        image TEXT
      );

      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending'
      );

      CREATE TABLE cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        UNIQUE (user_id, product_id)
      );

      CREATE TABLE favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        UNIQUE (user_id, product_id)
      );

      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed users 
    const hashedPassword = await bcrypt.hash('password123', 10);
    await db.query(`
      INSERT INTO users (username, email, password, is_admin) VALUES
      ('admin', 'admin@otaku.com', $1, true),
      ('user1', 'user1@otaku.com', $1, false);
    `, [hashedPassword]);

    // Seed products
    await db.query(`
      INSERT INTO products (name, description, price, image) VALUES
        ('Ichigo Figure 1', 'Thousand Year Blood War Ichigo Kurosaki 1', 30000, 'Ichigo-TYBW-1.webp'),
        ('Ichigo Figure 2', 'Thousand Year Blood War Ichigo Kurosaki 2', 40000, 'Ichigo-TYBW-2.webp'),
        ('Sasuke Figure 1', 'Eternal Mangekyō Sharingan Sasuke', 64700, 'Eternal-Mangekyou-Sharingan-Sasuke.webp'),
        ('Sasuke Figure 2', 'Naruto Shippuden Sasuke Uchiha', 20000, 'Uchiha-Sasuke-Naruto-Shippuden.webp'),
        ('Naruto Figure 1', 'Naruto Sage Art Lava Rasenshuriken', 10000, 'Naruto-Sage-Art-Lava-Rasenshuriken.avif'),
        ('Naruto Figure 2', 'Naruto Sage Mode', 30000, 'Naruto-Sage-Mode.jpg'),
        ('Toshiro Hitsugaya Figure', 'Thousand Year Blood War Toshiro Hitsugaya', 50000, 'Toshiro-Hitsugaya-TYBW.webp'),
        ('Zaraki Kenpachi', 'Thousand Year Blood War Zaraki Kenpachi', 60000, 'Zaraki-Kenpachi-TYBW.jpg'),
        ('Luffy Figure 1', 'Gear 5 Luffy', 70000, 'Luffy-Gear-5.webp'),
        ('Luffy Figure 2', 'One Piece Luffy', 80000, 'Luffy-and-Shanks.webp'),
        ('Nami Figure', 'Nami Climat-Tact', 50000, 'Nami-Climat-Tact.webp'),
        ('Kozuki Oden Figure', 'Kozuki Oden', 15000, 'Kozuki-Oden.jpg'),
        ('Demon Slayer Figure', 'Mitsuri Kanoji', 50000, 'Demon-Slayer-Mitsuri-Kanoji.jpg'),
        ('Demon Slayer Figure', 'Muichiro Tokito', 55000, 'Demon-Slayer-Muichiro-Tokito.jpg'),
        ('Demon Slayer Figure', 'Rengoku Kyojuro', 12500, 'Demon-Slayer-Rengoku-Kyojuro.jpg'),
        ('Demon Slayer Figure', 'Kokushibo', 80000, 'Kokushibo-Demon-Slayer-Model.jpg'),
        ('Demon Slayer Figure', 'Giyu Tomioka', 90000, 'Demon-Slayer-Giyu-Tomioka.jpg'),
        ('Rangiku Matsumoto Figure', 'Rangiku Matsumoto', 50000, 'Rangiku-Matsumoto.jpg'),
        ('Robin Figure', 'One Piece Robin', 30000, 'One-Piece-Robin.jpg');
    `);

    console.log('🌱 Database seeded!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    db.end();
  }
}

seed();
