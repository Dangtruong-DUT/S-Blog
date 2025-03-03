import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import { Express } from 'express';
import envConfig from './env.config';

export const configureSecurity = (app: Express): void => {
  // CORS - Cross Origin Resource Sharing
  app.use(
    cors({
      origin: envConfig.CLIENT_URL,
      credentials: true,
    })
  );

  // Set security HTTP headers
  app.use(helmet());

  // Rate limiting
  const limiter = rateLimit({
    max: 100, // Giới hạn 100 request
    windowMs: 60 * 60 * 1000, // trong 1 giờ
    message: 'Quá nhiều request từ IP này, vui lòng thử lại sau 1 giờ!',
  });
  app.use('/api', limiter);

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  app.use(
    hpp({
      whitelist: [
        'title',
        'content',
        'tags',
        'categories',
        'author',
        'status',
        'sort',
        'fields',
        'page',
        'limit',
      ],
    })
  );
}; 