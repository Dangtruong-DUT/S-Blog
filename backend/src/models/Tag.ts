import mongoose, { Document, Model } from 'mongoose';
import slugify from 'slugify';

export interface ITag extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new mongoose.Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, 'A tag must have a name'],
      unique: true,
      trim: true,
      minlength: [2, 'Tag name must be at least 2 characters long'],
      maxlength: [30, 'Tag name cannot be more than 30 characters long'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot be more than 200 characters long'],
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
      default: '#000000',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
tagSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'tags',
  localField: '_id',
});

// Tạo slug từ name trước khi lưu
tagSchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();

  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
  });
  next();
});

// Indexes
tagSchema.index({ slug: 1 });
tagSchema.index({ name: 'text' });

export const Tag: Model<ITag> = mongoose.model<ITag>('Tag', tagSchema); 