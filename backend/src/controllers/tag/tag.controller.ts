import { Request, Response, NextFunction } from 'express';
import Tag from '@/models/Tag';
import Post from '@/models/Post';
import { AppError } from '@/middleware/error.middleware';

// Tạo tag mới
export const createTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, icon, color } = req.body;

    const tag = await Tag.create({
      name,
      description,
      icon,
      color,
    });

    res.status(201).json({
      status: 'success',
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách tags
export const getTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });

    res.json({
      status: 'success',
      results: tags.length,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết tag
export const getTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = await Tag.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });

    if (!tag) {
      return next(new AppError('Tag not found', 404));
    }

    res.json({
      status: 'success',
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật tag
export const updateTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, icon, color } = req.body;

    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        icon,
        color,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tag) {
      return next(new AppError('Tag not found', 404));
    }

    res.json({
      status: 'success',
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa tag
export const deleteTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return next(new AppError('Tag not found', 404));
    }

    // Kiểm tra xem có bài viết nào sử dụng tag này không
    const postsCount = await Post.countDocuments({ tags: tag._id });
    if (postsCount > 0) {
      return next(
        new AppError(
          'Cannot delete tag because it is being used in posts. Please remove the tag from all posts first.',
          400
        )
      );
    }

    await tag.deleteOne();

    res.json({
      status: 'success',
      message: 'Tag deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Lấy bài viết theo tag
export const getTagPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tag = await Tag.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });

    if (!tag) {
      return next(new AppError('Tag not found', 404));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ tags: tag._id })
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Post.countDocuments({ tags: tag._id }),
    ]);

    res.json({
      status: 'success',
      results: posts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
}; 