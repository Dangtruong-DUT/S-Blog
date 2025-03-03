import swaggerJsdoc from 'swagger-jsdoc';
import envConfig from './env.config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'S-Blog API Documentation',
      version: '1.0.0',
      description: 'API documentation cho ứng dụng blog S-Blog',
      contact: {
        name: 'S-Blog Team',
        email: 'support@s-blog.com',
      },
    },
    servers: [
      {
        url: envConfig.API_URL,
        description: envConfig.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Đường dẫn tới các file chứa JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec; 