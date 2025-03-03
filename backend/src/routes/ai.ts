import { Router } from 'express';
import { protect } from '@/middlewares/auth/auth.middleware';
import { generateContent, improveContent } from '@/controllers/ai/ai.controller';

const router = Router();

router.use(protect); // Yêu cầu xác thực cho tất cả các routes

router.post('/generate', generateContent);
router.post('/improve', improveContent);

export default router; 