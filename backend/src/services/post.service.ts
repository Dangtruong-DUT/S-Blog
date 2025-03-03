import { Post } from '@/models/Post';
import { User } from '@/models/User';
import { AppError } from '@/middleware/error.middleware';
import mongoose from 'mongoose';

interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  categories?: string[];
  author: string;
}

interface UpdatePostData {
  title?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  categories?: string[];
}

export class PostService {
  /**
   * Tạo bài viết mới
   */
  public static async createPost(data: CreatePostData) {
    const post = await Post.create(data);
    return post;
  }

  /**
   * Lấy danh sách bài viết với phân trang và lọc
   */
  public static async getPosts(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Xây dựng query
    const queryObj = { ...query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let dbQuery = Post.find(JSON.parse(queryStr));

    // Sorting
    if (query.sort) {
      const sortBy = (query.sort as string).split(',').join(' ');
      dbQuery = dbQuery.sort(sortBy);
    } else {
      dbQuery = dbQuery.sort('-createdAt');
    }

    // Field limiting
    if (query.fields) {
      const fields = (query.fields as string).split(',').join(' ');
      dbQuery = dbQuery.select(fields);
    }

    // Pagination
    dbQuery = dbQuery.skip(skip).limit(limit);

    // Execute query
    const posts = await dbQuery;
    const total = await Post.countDocuments(JSON.parse(queryStr));

    return {
      posts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Lấy chi tiết một bài viết
   */
  public static async getPost(id: string) {
    const post = await Post.findById(id)
      .populate('author', 'name email')
      .populate('categories', 'name')
      .populate('tags', 'name');

    if (!post) {
      throw new AppError('No post found with that ID', 404);
    }

    return post;
  }

  /**
   * Cập nhật bài viết
   */
  public static async updatePost(id: string, data: UpdatePostData) {
    const post = await Post.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!post) {
      throw new AppError('No post found with that ID', 404);
    }

    return post;
  }

  /**
   * Xóa bài viết
   */
  public static async deletePost(id: string) {
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      throw new AppError('No post found with that ID', 404);
    }

    return { message: 'Post deleted successfully' };
  }

  /**
   * Like/Unlike bài viết
   */
  public static async toggleLike(postId: string, userId: string) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('No post found with that ID', 404);
    }

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(new mongoose.Types.ObjectId(userId));
    }

    await post.save();
    return post;
  }

  /**
   * Tìm kiếm bài viết
   */
  public static async searchPosts(query: string) {
    const posts = await Post.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10);

    return posts;
  }

  /**
   * Lấy bài viết phổ biến nhất
   */
  public static async getMostViewedPosts(limit: number = 5) {
    const posts = await Post.find()
      .sort('-views')
      .limit(limit)
      .populate('author', 'name');

    return posts;
  }
} 