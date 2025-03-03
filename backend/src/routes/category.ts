import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryPosts,
} from '@/controllers/category/category.controller';
import { protect, restrictTo } from '@/middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);
router.get('/:id/posts', getCategoryPosts);

// Admin only routes
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router; 