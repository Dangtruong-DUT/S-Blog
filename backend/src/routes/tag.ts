import { Router } from 'express';
import {
  createTag,
  getTags,
  getTag,
  updateTag,
  deleteTag,
  getTagPosts,
} from '@/controllers/tag/tag.controller';
import { protect, restrictTo } from '@/middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getTags);
router.get('/:id', getTag);
router.get('/:id/posts', getTagPosts);

// Admin only routes
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createTag);
router.patch('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router; 