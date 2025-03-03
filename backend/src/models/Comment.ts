import mongoose, { Document, Model } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  parent?: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'A comment must have content'],
      trim: true,
      minlength: [1, 'Comment must be at least 1 character long'],
      maxlength: [1000, 'Comment cannot be more than 1000 characters long'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A comment must have an author'],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'A comment must belong to a post'],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
commentSchema.virtual('replies', {
  ref: 'Comment',
  foreignField: 'parent',
  localField: '_id',
});

// Middleware để đánh dấu comment đã được chỉnh sửa
commentSchema.pre('save', function (next) {
  if (this.isModified('content') && this.createdAt) {
    this.isEdited = true;
  }
  next();
});

// Indexes
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ parent: 1 });
commentSchema.index({ author: 1 });

export const Comment: Model<IComment> = mongoose.model<IComment>('Comment', commentSchema); 