import { Types } from 'mongoose';
import User from '@/models/User';
import Post from '@/models/Post';

interface UserBehavior {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  action: 'view' | 'like' | 'comment' | 'bookmark' | 'share';
  duration?: number; // Thời gian đọc (giây)
  scrollDepth?: number; // Độ sâu cuộn trang (%)
}

export class UserBehaviorService {
  // Theo dõi hành vi người dùng
  static async trackBehavior(behavior: UserBehavior) {
    try {
      const user = await User.findById(behavior.userId);
      if (!user) return;

      // Cập nhật sở thích dựa trên hành vi
      const post = await Post.findById(behavior.postId).populate('tags');
      if (!post) return;

      let interestScore = 0;

      // Tính điểm quan tâm dựa trên hành vi
      switch (behavior.action) {
        case 'view':
          // Nếu xem > 30 giây và cuộn > 50%
          if ((behavior.duration || 0) > 30 && (behavior.scrollDepth || 0) > 50) {
            interestScore = 1;
          }
          break;
        case 'like':
          interestScore = 2;
          break;
        case 'comment':
          interestScore = 3;
          break;
        case 'bookmark':
          interestScore = 4;
          break;
        case 'share':
          interestScore = 5;
          break;
      }

      if (interestScore > 0) {
        // Thêm tags vào sở thích với trọng số
        const postTags = (post.tags as any[]).map(tag => tag.name.toLowerCase());
        const existingInterests = new Set(user.interests);
        
        postTags.forEach(tag => {
          if (!existingInterests.has(tag)) {
            user.interests.push(tag);
          }
        });

        // Cập nhật lịch sử đọc nếu chưa có
        if (!user.readHistory.includes(post._id)) {
          user.readHistory.push(post._id);
        }

        await user.save();
      }
    } catch (error) {
      console.error('Track behavior error:', error);
    }
  }

  // Phân tích sở thích người dùng
  static async analyzeUserInterests(userId: Types.ObjectId) {
    try {
      const user = await User.findById(userId)
        .populate({
          path: 'readHistory',
          populate: {
            path: 'tags'
          }
        });

      if (!user) return null;

      // Tạo map đếm tần suất của mỗi tag
      const tagFrequency = new Map<string, number>();
      
      user.readHistory.forEach((post: any) => {
        post.tags.forEach((tag: any) => {
          const tagName = tag.name.toLowerCase();
          tagFrequency.set(tagName, (tagFrequency.get(tagName) || 0) + 1);
        });
      });

      // Sắp xếp và lấy top tags
      const sortedTags = Array.from(tagFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag]) => tag);

      // Cập nhật sở thích chính của người dùng
      user.interests = sortedTags;
      await user.save();

      return sortedTags;
    } catch (error) {
      console.error('Analyze interests error:', error);
      return null;
    }
  }
}