import { Router } from 'express';
import { protect } from '@/middlewares/auth/auth.middleware';
import {
  schedulePost,
  getScheduledPosts,
  updateSchedule,
  deleteSchedule
} from '@/controllers/schedule/schedule.controller';

const router = Router();

router.use(protect); // Yêu cầu xác thực cho tất cả các routes

router.post('/', schedulePost);
router.get('/', getScheduledPosts);
router.put('/:scheduleId', updateSchedule);
router.delete('/:scheduleId', deleteSchedule);

export default router; 