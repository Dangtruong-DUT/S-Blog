import { Router } from 'express';
import { protect } from '@/middlewares/auth/auth.middleware';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  searchPosts,
} from '@/controllers/post/post.controller';

const router = Router();

// Public routes
router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/:id', getPost);

// Protected routes
router.use(protect);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', toggleLike);

export default router; 