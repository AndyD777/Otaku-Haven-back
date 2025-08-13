import express from 'express';
import requireAdmin from '../middleware/requireAdmin.js';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../db/queries/products.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// Get single product by ID (public)
router.get('/:id', async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Create new product (admin only)
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// Update product (admin only)
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const updatedProduct = await updateProduct(req.params.id, req.body);
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

// Delete product (admin only)
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
