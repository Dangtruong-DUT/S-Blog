import { Request, Response, NextFunction } from 'express';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { AppError } from '@/middleware/error.middleware';

// Tạo comment mới
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content, parentId } = req.body;
    const { postId } = req.params;

    // Kiểm tra bài viết tồn tại
    const post = await Post.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Tạo comment mới
    const comment = await Comment.create({
      postId,
      author: req.user!._id,
      content,
      parentId,
    });

    // Nếu là reply, thêm vào mảng replies của comment cha
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: comment._id },
      });
    }

    // Thêm comment vào bài viết
    post.comments.push(comment._id);
    await post.save();

    // Populate thông tin author
    await comment.populate('author', 'username avatar');

    res.status(201).json({
      status: 'success',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách comments của bài viết
export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Lấy comments gốc (không có parentId)
    const query = Comment.find({ postId, parentId: null })
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username avatar',
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const [comments, total] = await Promise.all([
      query.exec(),
      Comment.countDocuments({ postId, parentId: null }),
    ]);

    res.json({
      status: 'success',
      results: comments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật comment
export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    // Kiểm tra quyền
    if (comment.author.toString() !== req.user!._id.toString()) {
      return next(new AppError('You do not have permission to update this comment', 403));
    }

    comment.content = content;
    await comment.save();

    await comment.populate('author', 'username avatar');

    res.json({
      status: 'success',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa comment
export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    // Kiểm tra quyền
    if (comment.author.toString() !== req.user!._id.toString()) {
      return next(new AppError('You do not have permission to delete this comment', 403));
    }

    // Nếu là comment cha, xóa tất cả replies
    if (!comment.parentId) {
      await Comment.deleteMany({ parentId: comment._id });
    } else {
      // Nếu là reply, xóa khỏi mảng replies của comment cha
      await Comment.findByIdAndUpdate(comment.parentId, {
        $pull: { replies: comment._id },
      });
    }

    // Xóa comment khỏi bài viết
    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: comment._id },
    });

    await comment.deleteOne();

    res.json({
      status: 'success',
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}; 