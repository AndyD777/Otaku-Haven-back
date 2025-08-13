import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import getUserFromToken from './middleware/getUserFromToken.js';

import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import favoritesRouter from './routes/favorites.js';
import ordersRouter from './routes/orders.js';
import reviewsRouter from './routes/reviews.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: /localhost:\d+$/ 
}));
app.use(express.json());

app.use(getUserFromToken);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.message });
});

export default app;
