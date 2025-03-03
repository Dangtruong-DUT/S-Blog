import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { AppError } from '../error.middleware';
import mongoose from 'mongoose';

export const validateCreateTag = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, icon, color } = req.body;

  // Check name
  if (!name || !validator.isLength(name, { min: 2, max: 30 })) {
    return next(new AppError('Name must be between 2 and 30 characters', 400));
  }

  // Check description if provided
  if (description && !validator.isLength(description, { min: 10, max: 200 })) {
    return next(new AppError('Description must be between 10 and 200 characters', 400));
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

export const validateUpdateTag = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, icon, color } = req.body;

  // Check name if provided
  if (name && !validator.isLength(name, { min: 2, max: 30 })) {
    return next(new AppError('Name must be between 2 and 30 characters', 400));
  }

  // Check description if provided
  if (description && !validator.isLength(description, { min: 10, max: 200 })) {
    return next(new AppError('Description must be between 10 and 200 characters', 400));
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

export const validateTagId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Check if tag ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Please provide a valid tag ID', 400));
  }

  next();
}; 