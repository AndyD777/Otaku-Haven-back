import express from 'express';
import requireUser from '../middleware/requireUser.js';
import * as reviewsQueries from '../queries/reviews.js';

const router = express.Router();

// GET /api/reviews/:productId - all reviews for product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await reviewsQueries.getReviewsByProductId(req.params.productId);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews/:productId - add reviews for product
router.post('/:productId', requireUser, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) return res.status(400).json({ message: 'Rating is required' });

  try {
    const review = await reviewsQueries.addReview(req.user.id, req.params.productId, rating, comment);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
