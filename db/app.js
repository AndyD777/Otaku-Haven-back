import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import productsRouter from './routes/products.js';
import usersRouter from './routes/users.js';
import cartRouter from './routes/cart.js';
import favoritesRouter from './routes/favorites.js';
import ordersRouter from './routes/orders.js';
import reviewsRouter from './routes/reviews.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/favorites', favoritesRouter);
app.use('/orders', ordersRouter);
app.use('/reviews', reviewsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Otaku Haven API!');
});

export default app;