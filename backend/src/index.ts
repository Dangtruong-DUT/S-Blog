import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { env } from './config/env';
import { connectDB } from './config/database';

// Khởi tạo express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Tạo HTTP server
const httpServer = createServer(app);

// Khởi tạo Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Kết nối database
connectDB();

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Khởi động server
const PORT = env.PORT;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 