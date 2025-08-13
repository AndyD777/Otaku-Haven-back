import express from 'express';
import requireUser from '../middleware/requireUser.js';
import {
  getReviewsByProductId,
  addReview,
  updateReview,
  deleteReview
} from '../db/queries/reviews.js';

const router = express.Router();

// Get all reviews for a product (public)
router.get('/product/:productId', async (req, res, next) => {
  try {
    const reviews = await getReviewsByProductId(req.params.productId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.use(requireUser);

// Add a review
router.post('/', async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) return res.status(400).json({ message: 'productId and rating are required' });

    const review = await addReview({
      userId: req.user.id,
      productId,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

// Update a review
router.put('/:id', async (req, res, next) => {
  try {
    const review = await updateReview(req.params.id, req.body);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    next(err);
  }
});

// Delete a review
router.delete('/:id', async (req, res, next) => {
  try {
    await deleteReview(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;

