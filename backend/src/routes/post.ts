import { Router } from 'express';
import { protect, restrictTo } from '@/middleware/auth.middleware';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  searchPosts,
  getDailyViews,
  getMostViewedPosts,
  getAuthorTotalViews,
} from '@/controllers/post/post.controller';

import {
  getRecommendedPosts,
  getSimilarPosts,
  trackUserBehavior,
  getUserInterests,
  updateReadHistory
} from '@/controllers/post/recommendation.controller';

const router = Router();

// Public routes
router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/most-viewed', getMostViewedPosts);
router.get('/:id', getPost);
router.get('/:postId/daily-views', getDailyViews);
router.get('/author/:authorId/total-views', getAuthorTotalViews);
router.get('/:postId/similar', getSimilarPosts);

// Protected routes
router.use(protect);
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', toggleLike);

// Admin only routes
router.use(restrictTo('admin'));

// Recommendation routes
router.get('/recommended', protect, getRecommendedPosts);
router.post('/:postId/read', protect, updateReadHistory);
router.post('/behavior', protect, trackUserBehavior);
router.get('/interests', protect, getUserInterests);

export default router; 