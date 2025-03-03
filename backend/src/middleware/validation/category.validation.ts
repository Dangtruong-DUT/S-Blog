import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { AppError } from '../error.middleware';
import mongoose from 'mongoose';

export const validateCreateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, icon, color } = req.body;

  // Check name
  if (!name || !validator.isLength(name, { min: 2, max: 50 })) {
    return next(new AppError('Name must be between 2 and 50 characters', 400));
  }

  // Check description if provided
  if (description && !validator.isLength(description, { min: 10, max: 500 })) {
    return next(new AppError('Description must be between 10 and 500 characters', 400));
  }

  // Check icon if provided (should be a valid URL or icon name)
  if (icon && !validator.isLength(icon, { min: 1, max: 100 })) {
    return next(new AppError('Icon must be between 1 and 100 characters', 400));
  }

  // Check color if provided (should be a valid hex color)
  if (color && !validator.isHexColor(color)) {
    return next(new AppError('Color must be a valid hex color code', 400));
  }

  next();
};

export const validateUpdateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, icon, color } = req.body;

  // Check name if provided
  if (name && !validator.isLength(name, { min: 2, max: 50 })) {
    return next(new AppError('Name must be between 2 and 50 characters', 400));
  }

  // Check description if provided
  if (description && !validator.isLength(description, { min: 10, max: 500 })) {
    return next(new AppError('Description must be between 10 and 500 characters', 400));
  }

  // Check icon if provided
  if (icon && !validator.isLength(icon, { min: 1, max: 100 })) {
    return next(new AppError('Icon must be between 1 and 100 characters', 400));
  }

  // Check color if provided
  if (color && !validator.isHexColor(color)) {
    return next(new AppError('Color must be a valid hex color code', 400));
  }

  next();
};

export const validateCategoryId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Check if category ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Please provide a valid category ID', 400));
  }

  next();
}; 