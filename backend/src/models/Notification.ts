import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IPost } from './Post';
import { IComment } from './Comment';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId | IUser;
  sender: mongoose.Types.ObjectId | IUser;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  post?: mongoose.Types.ObjectId | IPost;
  comment?: mongoose.Types.ObjectId | IComment;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'follow', 'mention', 'system'],
      required: [true, 'Notification type is required'],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema); 