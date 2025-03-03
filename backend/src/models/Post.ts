import mongoose, { Document, Model } from 'mongoose';
import slugify from 'slugify';

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: mongoose.Types.ObjectId;
  categories: mongoose.Types.ObjectId[];
  tags: mongoose.Types.ObjectId[];
  status: 'draft' | 'published';
  views: number;
  likes: mongoose.Types.ObjectId[];
  readTime: number;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'A post must have a title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot be more than 100 characters long'],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'A post must have content'],
      minlength: [10, 'Content must be at least 10 characters long'],
    },
    excerpt: {
      type: String,
      required: [true, 'A post must have an excerpt'],
      trim: true,
      maxlength: [160, 'Excerpt cannot be more than 160 characters long'],
    },
    featuredImage: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A post must have an author'],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    readTime: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

// Tính thời gian đọc trước khi lưu
postSchema.pre('save', function (next) {
  // Tính thời gian đọc dựa trên số từ (trung bình 200 từ/phút)
  const words = this.content.trim().split(/\s+/).length;
  this.readTime = Math.ceil(words / 200);

  next();
});

// Tạo slug từ title trước khi lưu
postSchema.pre('save', function (next) {
  if (!this.isModified('title')) return next();

  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
  });
  next();
});

// Cập nhật publishedAt khi post được publish
postSchema.pre('save', function (next) {
  if (!this.isModified('isPublished')) return next();

  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
    this.status = 'published';
  }
  next();
});

// Indexes
postSchema.index({ slug: 1 });
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ categories: 1 });
postSchema.index({ tags: 1 });

export const Post: Model<IPost> = mongoose.model<IPost>('Post', postSchema); 