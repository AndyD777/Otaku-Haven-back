import express from 'express';
import { createUser, verifyUser } from '../db/queries/users.js';
import { signJwt } from '../utils/jwt.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing username, email, or password' });
  }

  try {
    const user = await createUser({ username, email, password });
    const token = signJwt(user);
    res.json({ user, token });
  } catch (err) {
    if (err.code === '23505') { 
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }
  try {
    const user = await verifyUser(username, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = signJwt(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
