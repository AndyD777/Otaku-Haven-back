import express from 'express';
import requireUser from '../middleware/requireUser.js';
import * as favoritesQueries from '../queries/favorites.js';

const router = express.Router();

router.use(requireUser);

router.get('/', async (req, res) => {
  try {
    const favorites = await favoritesQueries.getFavoritesByUserId(req.user.id);
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ message: 'product_id required' });
  try {
    const favorite = await favoritesQueries.addFavorite(req.user.id, product_id);
    if (!favorite) return res.status(409).json({ message: 'Already in favorites' });
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    await favoritesQueries.removeFavorite(req.user.id, req.params.productId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
