import { Types } from 'mongoose';
import Post from '@/models/Post';
import User from '@/models/User';
import { AIService } from './ai.service';
import { UserBehaviorService } from './user-behavior.service';

interface RecommendationScore {
  post: any;
  score: number;
}

export class RecommendationService {
  static async getRecommendedPosts(userId: string, limit: number = 10) {
    try {
      // Lấy thông tin người dùng
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      // Phân tích lại sở thích người dùng
      await UserBehaviorService.analyzeUserInterests(user._id);

      // Lấy tất cả bài viết (trừ những bài đã đọc)
      const posts = await Post.find({
        _id: { $nin: user.readHistory },
        status: 'published'
      })
        .populate('author', 'username avatar')
        .populate('tags')
        .sort({ createdAt: -1 });

      // Tính điểm phù hợp cho mỗi bài viết
      const scoredPosts: RecommendationScore[] = await Promise.all(
        posts.map(async (post) => {
          let score = 0;

          // 1. Điểm dựa trên sở thích (tăng trọng số lên 5)
          const interestMatch = user.interests.some(interest =>
            post.tags.some((tag: any) => 
              tag.name.toLowerCase().includes(interest.toLowerCase())
            )
          );
          if (interestMatch) score += 5;

          // 2. Điểm dựa trên độ phổ biến
          score += Math.min(post.views / 100, 2); // Tối đa 2 điểm
          score += Math.min(post.likes.length / 10, 2); // Tối đa 2 điểm

          // 3. Điểm dựa trên độ mới
          const daysSincePublished = (Date.now() - post.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          score += Math.max(0, 3 - daysSincePublished / 30); // Giảm dần trong 3 tháng

          // 4. Điểm dựa trên tác giả
          // Nếu người dùng đã đọc nhiều bài của tác giả này
          const authorPosts = await Post.find({
            author: post.author._id,
            _id: { $in: user.readHistory }
          });
          if (authorPosts.length > 0) {
            score += Math.min(authorPosts.length, 3); // Tối đa 3 điểm
          }

          // 5. Sử dụng AI để phân tích độ phù hợp của nội dung
          try {
            const contentSimilarity = await AIService.analyzeContentSimilarity(
              post.content,
              user.interests.join(', ')
            );
            score += contentSimilarity * 3; // Tối đa 3 điểm
          } catch (error) {
            console.error('AI analysis error:', error);
          }

          return { post, score };
        })
      );

      // Sắp xếp theo điểm và lấy số lượng bài viết theo limit
      const recommendedPosts = scoredPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => ({
          ...item.post.toObject(),
          matchScore: Math.round(item.score * 10) // Thêm điểm phù hợp (0-100)
        }));

      return recommendedPosts;
    } catch (error) {
      console.error('Recommendation error:', error);
      throw error;
    }
  }

  static async updateUserInterests(userId: string, postId: string) {
    try {
      // Theo dõi hành vi đọc
      await UserBehaviorService.trackBehavior({
        userId: new Types.ObjectId(userId),
        postId: new Types.ObjectId(postId),
        action: 'view'
      });

      // Phân tích lại sở thích
      await UserBehaviorService.analyzeUserInterests(new Types.ObjectId(userId));
    } catch (error) {
      console.error('Update interests error:', error);
    }
  }

  static async getSimilarPosts(postId: string, limit: number = 5) {
    try {
      const post = await Post.findById(postId).populate('tags');
      if (!post) throw new Error('Post not found');

      const similarPosts = await Post.find({
        _id: { $ne: post._id },
        status: 'published',
        tags: { $in: post.tags }
      })
        .populate('author', 'username avatar')
        .populate('tags')
        .limit(limit * 2);

      // Tính điểm tương đồng cho mỗi bài viết
      const scoredPosts = await Promise.all(
        similarPosts.map(async (similarPost) => {
          let score = 0;

          // 1. Điểm dựa trên tags chung
          const commonTags = similarPost.tags.filter((tag: any) =>
            post.tags.some((postTag: any) => postTag._id.equals(tag._id))
          );
          score += commonTags.length * 2;

          // 2. Sử dụng AI để phân tích độ tương đồng nội dung
          try {
            const contentSimilarity = await AIService.analyzeContentSimilarity(
              similarPost.content,
              post.content
            );
            score += contentSimilarity * 5;
          } catch (error) {
            console.error('AI analysis error:', error);
          }

          return { post: similarPost, score };
        })
      );

      // Sắp xếp và lấy top bài viết tương đồng nhất
      return scoredPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.post);
    } catch (error) {
      console.error('Get similar posts error:', error);
      throw error;
    }
  }
} 