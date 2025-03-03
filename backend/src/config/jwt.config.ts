import jwt from 'jsonwebtoken';
import envConfig from './env.config';

interface TokenPayload {
  id: string;
  role: string;
}

// Tạo JWT token
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, envConfig.JWT_SECRET, {
    expiresIn: envConfig.JWT_EXPIRES_IN,
  });
};

// Verify JWT token
export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error: any) {
    throw new Error('Invalid token');
  }
};

// Decode JWT token mà không verify
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}; 