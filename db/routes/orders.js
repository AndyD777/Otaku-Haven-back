import express from 'express';
import requireUser from '../middleware/requireUser.js';
import * as ordersQueries from '../queries/orders.js';
import * as cartQueries from '../queries/cart.js';

const router = express.Router();

router.use(requireUser);

// POST /api/orders - Creates orders from cart items
router.post('/', async (req, res) => {
  try {
    const cartItems = await cartQueries.getCartItemsByUserId(req.user.id);
    if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    const order = await ordersQueries.createOrder(req.user.id, cartItems);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders - Lists orders of user
router.get('/', async (req, res) => {
  try {
    const orders = await ordersQueries.getOrdersByUserId(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id - The user's order details
router.get('/:id', async (req, res) => {
  try {
    const details = await ordersQueries.getOrderDetails(req.params.id);
    if (!details.order) return res.status(404).json({ message: 'Order not found' });
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
