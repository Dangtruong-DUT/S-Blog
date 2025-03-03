import { Request, Response, NextFunction } from 'express';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import { AppError } from '@/middleware/error.middleware';

// Tạo bài viết mới
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, tags, hashtags, image } = req.body;

    const post = await Post.create({
      title,
      content,
      tags,
      hashtags,
      image,
      author: req.user!._id,
    });

    res.status(201).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách bài viết
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query = Post.find()
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Áp dụng các bộ lọc
    if (req.query.tag) {
      query.where('tags').in([req.query.tag]);
    }
    if (req.query.hashtag) {
      query.where('hashtags').in([req.query.hashtag]);
    }
    if (req.query.author) {
      query.where('author').equals(req.query.author);
    }

    const [posts, total] = await Promise.all([
      query.exec(),
      Post.countDocuments(query.getQuery()),
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

// Lấy chi tiết bài viết
export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username avatar',
        },
      });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Tăng lượt xem
    post.views += 1;
    await post.save();

    res.json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật bài viết
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, tags, hashtags, image } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Kiểm tra quyền
    if (post.author.toString() !== req.user!._id.toString()) {
      return next(new AppError('You do not have permission to update this post', 403));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        tags,
        hashtags,
        image,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('author', 'username avatar');

    res.json({
      status: 'success',
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa bài viết
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Kiểm tra quyền
    if (post.author.toString() !== req.user!._id.toString()) {
      return next(new AppError('You do not have permission to delete this post', 403));
    }

    // Xóa tất cả comments của bài viết
    await Comment.deleteMany({ postId: post._id });

    await post.deleteOne();

    res.json({
      status: 'success',
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike bài viết
export const toggleLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    const userId = req.user!._id;
    const userIdString = userId.toString();

    // Kiểm tra xem user đã like chưa
    const likeIndex = post.likes.findIndex(
      (id) => id.toString() === userIdString
    );

    if (likeIndex === -1) {
      // Chưa like thì thêm vào
      post.likes.push(userId);
    } else {
      // Đã like thì xóa đi
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.json({
      status: 'success',
      liked: likeIndex === -1,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// Tìm kiếm bài viết
export const searchPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return next(new AppError('Search query is required', 400));
    }

    const [posts, total] = await Promise.all([
      Post.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .populate('author', 'username avatar')
        .skip(skip)
        .limit(limit)
        .exec(),
      Post.countDocuments({ $text: { $search: query } }),
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

// Lấy thống kê lượt xem theo ngày
export const getDailyViews = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailyStats = await Post.aggregate([
      {
        $match: {
          _id: post._id,
          updatedAt: { $gte: lastWeek }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          views: { $sum: "$views" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(dailyStats);
  } catch (error) {
    console.error('Get daily views error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy top bài viết được xem nhiều nhất
export const getMostViewedPosts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const posts = await Post.find()
      .sort({ views: -1 })
      .limit(limit)
      .populate('author', 'username avatar')
      .select('title views createdAt updatedAt');

    res.json(posts);
  } catch (error) {
    console.error('Get most viewed posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy tổng số lượt xem của tất cả bài viết của một tác giả
export const getAuthorTotalViews = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;

    const stats = await Post.aggregate([
      {
        $match: { author: authorId }
      },
      {
        $group: {
          _id: "$author",
          totalViews: { $sum: "$views" },
          totalPosts: { $sum: 1 }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(404).json({ message: 'No posts found for this author' });
    }

    res.json(stats[0]);
  } catch (error) {
    console.error('Get author total views error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};