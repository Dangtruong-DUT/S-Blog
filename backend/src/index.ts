import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { env } from './config/env';
import { connectDB } from './config/database';

// Import routes
import authRoutes from './routes/auth';
import postRoutes from './routes/post';

// Khởi tạo express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

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

  // Handle real-time comments
  socket.on('join_post', (postId: string) => {
    socket.join(postId);
  });

  socket.on('leave_post', (postId: string) => {
    socket.leave(postId);
  });

  socket.on('new_comment', (data: { postId: string; comment: any }) => {
    io.to(data.postId).emit('comment_added', data.comment);
  });

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

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Khởi động server
const PORT = env.PORT;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 