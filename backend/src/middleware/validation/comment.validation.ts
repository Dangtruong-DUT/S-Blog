import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { AppError } from '../error.middleware';
import mongoose from 'mongoose';

export const validateCreateComment = (req: Request, res: Response, next: NextFunction) => {
  const { content, postId, parentId } = req.body;

  // Check content
  if (!content || !validator.isLength(content, { min: 1, max: 1000 })) {
    return next(new AppError('Content must be between 1 and 1000 characters', 400));
  }

  // Check postId
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return next(new AppError('Please provide a valid post ID', 400));
  }

  // Check parentId if provided (for replies)
  if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
    return next(new AppError('Please provide a valid parent comment ID', 400));
  }

  next();
};

export const validateUpdateComment = (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body;

  // Check content
  if (!content || !validator.isLength(content, { min: 1, max: 1000 })) {
    return next(new AppError('Content must be between 1 and 1000 characters', 400));
  }

  next();
};

export const validateCommentId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Check if comment ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Please provide a valid comment ID', 400));
  }

  next();
}; 