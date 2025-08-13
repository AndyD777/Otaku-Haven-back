import express from 'express';
import requireUser from '../middleware/requireUser.js';
import {
  getCartItemsByUserId,
  addToCart,
  updateCartItem,
  removeCartItem
} from '../db/queries/cart.js';

const router = express.Router();

router.use(requireUser);

// Gets cart items for current user
router.get('/', async (req, res, next) => {
  try {
    const items = await getCartItemsByUserId(req.user.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// Add product to cart or update quantity
router.post('/', async (req, res, next) => {
  const { product_id, quantity } = req.body;
  if (!product_id || quantity === undefined) {
    return res.status(400).json({ message: 'product_id and quantity are required' });
  }

  try {
    const cartItem = await addToCart(req.user.id, product_id, quantity);
    res.status(201).json(cartItem);
  } catch (err) {
    next(err);
  }
});

// Update cart item quantity
router.put('/', async (req, res, next) => {
  const { product_id, quantity } = req.body;
  if (!product_id || quantity === undefined) {
    return res.status(400).json({ message: 'product_id and quantity are required' });
  }
  try {
    const updated = await updateCartItem(req.user.id, product_id, quantity);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Remove cart item
router.delete('/:product_id', async (req, res, next) => {
  try {
    await removeCartItem(req.user.id, req.params.product_id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
