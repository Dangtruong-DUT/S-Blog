import { Router } from 'express';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from '@/controllers/comment/comment.controller';
import { protect } from '@/middleware/auth.middleware';

const router = Router({ mergeParams: true }); // Cho phép truy cập params từ parent router

// Public routes
router.get('/', getComments);

// Protected routes
router.use(protect);

router.post('/', createComment);
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router; 