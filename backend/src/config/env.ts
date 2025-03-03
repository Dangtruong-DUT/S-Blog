import { cleanEnv, str, num } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  PORT: num({ default: 5000 }),
  MONGODB_URI: str(),
  
  // JWT config
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '1h' }),
  
  // Frontend config
  FRONTEND_URL: str({ default: 'http://localhost:3000' }),
  
  // CORS config  
  CORS_ORIGIN: str({ default: '*' }),

  // SMTP config
  SMTP_HOST: str({ default: undefined }),
  SMTP_PORT: str({ default: undefined }),
  SMTP_USER: str({ default: undefined }),
  SMTP_PASS: str({ default: undefined }),

  // OAuth config
  GOOGLE_CLIENT_ID: str({ default: undefined }),
  GOOGLE_CLIENT_SECRET: str({ default: undefined }),
  FACEBOOK_APP_ID: str({ default: undefined }),
  FACEBOOK_APP_SECRET: str({ default: undefined }),
}); 