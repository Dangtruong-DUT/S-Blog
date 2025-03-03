import { Comment } from '@/models/Comment';
import { Post } from '@/models/Post';
import { AppError } from '@/middleware/error.middleware';
import mongoose from 'mongoose';

interface CreateCommentData {
  content: string;
  author: string;
  post: string;
  parent?: string;
}

interface UpdateCommentData {
  content: string;
}

export class CommentService {
  /**
   * Tạo comment mới
   */
  public static async createComment(data: CreateCommentData) {
    // Kiểm tra bài viết tồn tại
    const post = await Post.findById(data.post);
    if (!post) {
      throw new AppError('No post found with that ID', 404);
    }

    // Kiểm tra parent comment nếu có
    if (data.parent) {
      const parentComment = await Comment.findById(data.parent);
      if (!parentComment) {
        throw new AppError('No parent comment found with that ID', 404);
      }
    }

    // Tạo comment
    const comment = await Comment.create(data);

    // Populate author
    await comment.populate('author', 'name email');

    return comment;
  }

  /**
   * Lấy danh sách comments của một bài viết
   */
  public static async getComments(postId: string, query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Lấy comments gốc (không có parent)
    const comments = await Comment.find({ post: postId, parent: null })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'name email'
        }
      });

    const total = await Comment.countDocuments({ post: postId, parent: null });

    return {
      comments,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Lấy chi tiết một comment
   */
  public static async getComment(id: string) {
    const comment = await Comment.findById(id)
      .populate('author', 'name email')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'name email'
        }
      });

    if (!comment) {
      throw new AppError('No comment found with that ID', 404);
    }

    return comment;
  }

  /**
   * Cập nhật comment
   */
  public static async updateComment(id: string, userId: string, data: UpdateCommentData) {
    const comment = await Comment.findById(id);

    if (!comment) {
      throw new AppError('No comment found with that ID', 404);
    }

    // Kiểm tra quyền chỉnh sửa
    if (comment.author.toString() !== userId) {
      throw new AppError('You do not have permission to edit this comment', 403);
    }

    // Cập nhật comment
    comment.content = data.content;
    await comment.save();

    return comment;
  }

  /**
   * Xóa comment
   */
  public static async deleteComment(id: string, userId: string) {
    const comment = await Comment.findById(id);

    if (!comment) {
      throw new AppError('No comment found with that ID', 404);
    }

    // Kiểm tra quyền xóa
    if (comment.author.toString() !== userId) {
      throw new AppError('You do not have permission to delete this comment', 403);
    }

    // Xóa tất cả replies của comment này
    await Comment.deleteMany({ parent: id });

    // Xóa comment
    await comment.deleteOne();

    return { message: 'Comment deleted successfully' };
  }

  /**
   * Lấy danh sách replies của một comment
   */
  public static async getReplies(commentId: string, query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const replies = await Comment.find({ parent: commentId })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email');

    const total = await Comment.countDocuments({ parent: commentId });

    return {
      replies,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }
} 