import express from 'express';
import { 
  getUserById, 
  getAllUsers, 
  updateUserById, 
  deleteUserById 
} from '../db/queries/users.js';
import requireUser from '../middleware/requireUser.js';
import requireAdmin from '../middleware/requireAdmin.js';

const router = express.Router();

// Require logged-in user for all routes below
router.use(requireUser);

// GET /api/users - get all users (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id - get one user (admin or self)
router.get('/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (req.user.id !== userId && !req.user.is_admin) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/users/:id - update user (admin or self)
router.patch('/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (req.user.id !== userId && !req.user.is_admin) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updatedUser = await updateUserById(userId, req.body);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/:id - delete user (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    await deleteUserById(userId);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
