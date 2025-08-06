import express from 'express';
import requireUser from '../middleware/requireUser.js';
import * as cartQueries from '../queries/cart.js';

const router = express.Router();

router.use(requireUser);

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const items = await cartQueries.getCartItemsByUserId(req.user.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart (adds items)
router.post('/', async (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) {
    return res.status(400).json({ message: 'product_id and quantity required' });
  }
  try {
    const item = await cartQueries.addItemToCart(req.user.id, product_id, quantity);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart/:productId (removes items)
router.delete('/:productId', async (req, res) => {
  try {
    await cartQueries.removeItemFromCart(req.user.id, req.params.productId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
