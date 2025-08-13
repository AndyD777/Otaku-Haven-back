import express from 'express';
import requireUser from '../middleware/requireUser.js';
import { getFavoritesByUserId, addFavorite, removeFavorite } from '../db/queries/favorites.js';

const router = express.Router();

router.use(requireUser);

// Gets all favorites for current user
router.get('/', async (req, res, next) => {
  try {
    const favorites = await getFavoritesByUserId(req.user.id);
    res.json(favorites);
  } catch (err) {
    next(err);
  }
});

// Add favorite
router.post('/', async (req, res, next) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ message: 'product_id required' });

  try {
    const favorite = await addFavorite(req.user.id, product_id);
    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
});

// Remove favorite
router.delete('/:product_id', async (req, res, next) => {
  try {
    await removeFavorite(req.user.id, req.params.product_id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
