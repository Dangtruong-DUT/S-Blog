import winston from 'winston';
import path from 'path';
import envConfig from './env.config';

// Định dạng log
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Cấu hình logger
const logger = winston.createLogger({
  level: envConfig.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports: [
    // Ghi log vào file
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
    }),
  ],
});

// Nếu không phải môi trường production thì log ra console
if (envConfig.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Xử lý unhandled rejections
process.on('unhandledRejection', (error: Error) => {
  logger.error('Unhandled Rejection:', error);
  // Không tắt process trong môi trường development
  if (envConfig.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Xử lý uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  // Không tắt process trong môi trường development
  if (envConfig.NODE_ENV === 'production') {
    process.exit(1);
  }
});

export default logger; 