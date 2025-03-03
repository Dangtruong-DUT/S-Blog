import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvConfig {
  // Server
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  API_URL: string;
  CLIENT_URL: string;

  // Database
  MONGODB_URI: string;

  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // Email
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USERNAME: string;
  EMAIL_PASSWORD: string;
  EMAIL_FROM: string;

  // Cloud Storage
  CLOUD_NAME: string;
  CLOUD_API_KEY: string;
  CLOUD_API_SECRET: string;
}

const getConfig = (): EnvConfig => {
  return {
    // Server
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    PORT: Number(process.env.PORT) || 5000,
    API_URL: process.env.API_URL || 'http://localhost:5000',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

    // Database
    MONGODB_URI:
      process.env.MONGODB_URI || 'mongodb://localhost:27017/s-blog',

    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'super-secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    // Email
    EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME || '',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@s-blog.com',

    // Cloud Storage
    CLOUD_NAME: process.env.CLOUD_NAME || '',
    CLOUD_API_KEY: process.env.CLOUD_API_KEY || '',
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET || '',
  };
};

const envConfig: EnvConfig = getConfig();

export default envConfig; 