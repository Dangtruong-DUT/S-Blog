import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule extends Document {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  scheduledDate: Date;
  status: 'pending' | 'published' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index cho việc tìm kiếm các bài đăng theo lịch
scheduleSchema.index({ scheduledDate: 1, status: 1 });

export default mongoose.model<ISchedule>('Schedule', scheduleSchema); 