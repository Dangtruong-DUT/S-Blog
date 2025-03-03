import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { AppError } from '../error.middleware';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, passwordConfirm } = req.body;

  // Check if name exists and is not empty
  if (!name || !validator.isLength(name, { min: 2, max: 50 })) {
    return next(new AppError('Name must be between 2 and 50 characters', 400));
  }

  // Check if email exists and is valid
  if (!email || !validator.isEmail(email)) {
    return next(new AppError('Please provide a valid email', 400));
  }

  // Check if password exists and meets requirements
  if (!password || !validator.isLength(password, { min: 8 })) {
    return next(
      new AppError('Password must be at least 8 characters long', 400)
    );
  }

  // Check if password contains at least one number and one letter
  if (!validator.isStrongPassword(password, { 
    minLength: 8, 
    minLowercase: 1, 
    minUppercase: 1, 
    minNumbers: 1,
    minSymbols: 0 
  })) {
    return next(
      new AppError(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        400
      )
    );
  }

  // Check if passwords match
  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if email is valid
  if (!validator.isEmail(email)) {
    return next(new AppError('Please provide a valid email', 400));
  }

  next();
};

export const validateForgotPassword = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  // Check if email exists and is valid
  if (!email || !validator.isEmail(email)) {
    return next(new AppError('Please provide a valid email', 400));
  }

  next();
};

export const validateResetPassword = (req: Request, res: Response, next: NextFunction) => {
  const { password, passwordConfirm } = req.body;

  // Check if password exists and meets requirements
  if (!password || !validator.isLength(password, { min: 8 })) {
    return next(
      new AppError('Password must be at least 8 characters long', 400)
    );
  }

  // Check if password contains at least one number and one letter
  if (!validator.isStrongPassword(password, { 
    minLength: 8, 
    minLowercase: 1, 
    minUppercase: 1, 
    minNumbers: 1,
    minSymbols: 0 
  })) {
    return next(
      new AppError(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        400
      )
    );
  }

  // Check if passwords match
  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  next();
}; 