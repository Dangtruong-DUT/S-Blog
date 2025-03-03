import { Request, Response } from 'express';
import Post from '@/models/Post';

// Tạo bài viết mới
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, tags, hashtags } = req.body;
    const post = new Post({
      author: req.user._id,
      title,
      content,
      tags,
      hashtags,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy tất cả bài viết (có phân trang)
export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Lấy chi tiết bài viết
export const getPost = async (req: Request, res: Response) => {
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
      return res.status(404).json({ message: 'Post not found' });
    }

    // Tăng số lượt xem
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cập nhật bài viết
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { title, content, tags, hashtags } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Kiểm tra quyền
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.title = title;
    post.content = content;
    post.tags = tags;
    post.hashtags = hashtags;

    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Xóa bài viết
export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Kiểm tra quyền
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Like/Unlike bài viết
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Tìm kiếm bài viết
export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find(
      { $text: { $search: q as string } },
      { score: { $meta: 'textScore' } }
    )
      .populate('author', 'username avatar')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ $text: { $search: q as string } });

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 