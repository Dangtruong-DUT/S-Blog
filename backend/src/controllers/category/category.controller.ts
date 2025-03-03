import { Request, Response, NextFunction } from 'express';
import Category from '@/models/Category';
import Post from '@/models/Post';
import { AppError } from '@/middleware/error.middleware';

// Tạo category mới
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, icon, color } = req.body;

    const category = await Category.create({
      name,
      description,
      icon,
      color,
    });

    res.status(201).json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json({
      status: 'success',
      results: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết category
export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật category
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, icon, color } = req.body;

    const category = await Category.findByIdAndUpdate(
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

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.json({
      status: 'success',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa category
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    // Kiểm tra xem có bài viết nào thuộc category này không
    const postsCount = await Post.countDocuments({ category: category._id });
    if (postsCount > 0) {
      return next(
        new AppError(
          'Cannot delete category because it contains posts. Please move or delete the posts first.',
          400
        )
      );
    }

    await category.deleteOne();

    res.json({
      status: 'success',
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Lấy bài viết theo category
export const getCategoryPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ category: category._id })
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Post.countDocuments({ category: category._id }),
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