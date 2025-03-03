import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { AppError } from '../error.middleware';

export const validateCreatePost = (req: Request, res: Response, next: NextFunction) => {
  const { title, content, excerpt, tags, categories } = req.body;

  // Check title
  if (!title || !validator.isLength(title, { min: 3, max: 100 })) {
    return next(new AppError('Title must be between 3 and 100 characters', 400));
  }

  // Check content
  if (!content || !validator.isLength(content, { min: 10 })) {
    return next(new AppError('Content must be at least 10 characters long', 400));
  }

  // Check excerpt
  if (excerpt && !validator.isLength(excerpt, { min: 10, max: 160 })) {
    return next(new AppError('Excerpt must be between 10 and 160 characters', 400));
  }

  // Check tags
  if (tags && !Array.isArray(tags)) {
    return next(new AppError('Tags must be an array', 400));
  }

  // Check categories
  if (categories && !Array.isArray(categories)) {
    return next(new AppError('Categories must be an array', 400));
  }

  next();
};

export const validateUpdatePost = (req: Request, res: Response, next: NextFunction) => {
  const { title, content, excerpt, tags, categories } = req.body;

  // Check title if provided
  if (title && !validator.isLength(title, { min: 3, max: 100 })) {
    return next(new AppError('Title must be between 3 and 100 characters', 400));
  }

  // Check content if provided
  if (content && !validator.isLength(content, { min: 10 })) {
    return next(new AppError('Content must be at least 10 characters long', 400));
  }

  // Check excerpt if provided
  if (excerpt && !validator.isLength(excerpt, { min: 10, max: 160 })) {
    return next(new AppError('Excerpt must be between 10 and 160 characters', 400));
  }

  // Check tags if provided
  if (tags && !Array.isArray(tags)) {
    return next(new AppError('Tags must be an array', 400));
  }

  // Check categories if provided
  if (categories && !Array.isArray(categories)) {
    return next(new AppError('Categories must be an array', 400));
  }

  next();
}; 