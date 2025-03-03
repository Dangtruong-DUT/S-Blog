import mongoose from 'mongoose';
import envConfig from './env.config';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(envConfig.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Xử lý các sự kiện của connection
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Xử lý khi process kết thúc
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Cấu hình mongoose
mongoose.set('strictQuery', true); // Chỉ cho phép các field đã định nghĩa trong schema
mongoose.set('debug', envConfig.NODE_ENV === 'development'); // Log các query trong development 