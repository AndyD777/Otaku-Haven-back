import express from 'express';
import requireUser from '../middleware/requireUser.js';
import { getUserById } from '../queries/users.js';

const router = express.Router();

router.use(requireUser);

// GET /api/users/me - Gets current user's info
router.get('/me', async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
