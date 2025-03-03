import { Request, Response } from 'express';
import { RecommendationService } from '@/services/recommendation.service';
import { UserBehaviorService } from '@/services/user-behavior.service';

export const getRecommendedPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit as string) || 10;

    const posts = await RecommendationService.getRecommendedPosts(userId, limit);
    res.json(posts);
  } catch (error) {
    console.error('Get recommended posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSimilarPosts = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    const posts = await RecommendationService.getSimilarPosts(postId, limit);
    res.json(posts);
  } catch (error) {
    console.error('Get similar posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const trackUserBehavior = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { postId, action, duration, scrollDepth } = req.body;

    await UserBehaviorService.trackBehavior({
      userId,
      postId,
      action,
      duration,
      scrollDepth
    });

    res.json({ message: 'Behavior tracked successfully' });
  } catch (error) {
    console.error('Track behavior error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserInterests = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const interests = await UserBehaviorService.analyzeUserInterests(userId);
    res.json({ interests });
  } catch (error) {
    console.error('Get user interests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateReadHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { postId } = req.params;

    await RecommendationService.updateUserInterests(userId, postId);
    res.json({ message: 'Read history updated successfully' });
  } catch (error) {
    console.error('Update read history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 