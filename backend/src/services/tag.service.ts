import { Tag } from '@/models/Tag';
import { Post } from '@/models/Post';
import { AppError } from '@/middleware/error.middleware';

interface CreateTagData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

interface UpdateTagData {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export class TagService {
  /**
   * Tạo tag mới
   */
  public static async createTag(data: CreateTagData) {
    // Kiểm tra tên tag đã tồn tại
    const existingTag = await Tag.findOne({ name: data.name });
    if (existingTag) {
      throw new AppError('Tag with this name already exists', 400);
    }

    const tag = await Tag.create(data);
    return tag;
  }

  /**
   * Lấy danh sách tags
   */
  public static async getTags(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const tags = await Tag.find()
      .sort('name')
      .skip(skip)
      .limit(limit);

    const total = await Tag.countDocuments();

    return {
      tags,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Lấy chi tiết một tag
   */
  public static async getTag(id: string) {
    const tag = await Tag.findById(id);

    if (!tag) {
      throw new AppError('No tag found with that ID', 404);
    }

    return tag;
  }

  /**
   * Cập nhật tag
   */
  public static async updateTag(id: string, data: UpdateTagData) {
    // Kiểm tra tên tag đã tồn tại (nếu đang cập nhật tên)
    if (data.name) {
      const existingTag = await Tag.findOne({
        name: data.name,
        _id: { $ne: id }
      });
      if (existingTag) {
        throw new AppError('Tag with this name already exists', 400);
      }
    }

    const tag = await Tag.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!tag) {
      throw new AppError('No tag found with that ID', 404);
    }

    return tag;
  }

  /**
   * Xóa tag
   */
  public static async deleteTag(id: string) {
    // Kiểm tra xem có bài viết nào đang sử dụng tag này không
    const postsCount = await Post.countDocuments({ tags: id });
    if (postsCount > 0) {
      throw new AppError(
        'Cannot delete tag because it is being used by posts',
        400
      );
    }

    const tag = await Tag.findByIdAndDelete(id);

    if (!tag) {
      throw new AppError('No tag found with that ID', 404);
    }

    return { message: 'Tag deleted successfully' };
  }

  /**
   * Lấy danh sách bài viết có tag
   */
  public static async getTagPosts(tagId: string, query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ tags: tagId })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email')
      .populate('categories', 'name')
      .populate('tags', 'name');

    const total = await Post.countDocuments({ tags: tagId });

    return {
      posts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Lấy danh sách tags phổ biến nhất
   */
  public static async getPopularTags(limit: number = 10) {
    const tags = await Tag.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'tags',
          as: 'posts'
        }
      },
      {
        $project: {
          name: 1,
          postsCount: { $size: '$posts' }
        }
      },
      {
        $sort: { postsCount: -1 }
      },
      {
        $limit: limit
      }
    ]);

    return tags;
  }
} 