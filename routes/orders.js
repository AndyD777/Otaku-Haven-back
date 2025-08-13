import express from 'express';
import requireUser from '../middleware/requireUser.js';
import {
  getOrdersByUserId,
  createOrder,
  getOrderById,
  updateOrderStatus
} from '../db/queries/orders.js';

const router = express.Router();

router.use(requireUser);

// Gets all orders for current user
router.get('/', async (req, res, next) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Create new order (mock checkout)
router.post('/', async (req, res, next) => {
  try {
    const order = await createOrder(req.user.id);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// Get order by ID
router.get('/:id', async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// Update order status (admin only)
router.put('/:id/status', requireUser, async (req, res, next) => {
  if (!req.user.is_admin) return res.status(403).json({ message: 'Admins only' });
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status required' });
    const updatedOrder = await updateOrderStatus(req.params.id, status);
    res.json(updatedOrder);
  } catch (err) {
    next(err);
  }
});

export default router;
