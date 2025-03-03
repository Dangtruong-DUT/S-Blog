import { Category } from '@/models/Category';
import { Post } from '@/models/Post';
import { AppError } from '@/middleware/error.middleware';

interface CreateCategoryData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

interface UpdateCategoryData {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export class CategoryService {
  /**
   * Tạo category mới
   */
  public static async createCategory(data: CreateCategoryData) {
    // Kiểm tra tên category đã tồn tại
    const existingCategory = await Category.findOne({ name: data.name });
    if (existingCategory) {
      throw new AppError('Category with this name already exists', 400);
    }

    const category = await Category.create(data);
    return category;
  }

  /**
   * Lấy danh sách categories
   */
  public static async getCategories(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find()
      .sort('name')
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments();

    return {
      categories,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Lấy chi tiết một category
   */
  public static async getCategory(id: string) {
    const category = await Category.findById(id);

    if (!category) {
      throw new AppError('No category found with that ID', 404);
    }

    return category;
  }

  /**
   * Cập nhật category
   */
  public static async updateCategory(id: string, data: UpdateCategoryData) {
    // Kiểm tra tên category đã tồn tại (nếu đang cập nhật tên)
    if (data.name) {
      const existingCategory = await Category.findOne({
        name: data.name,
        _id: { $ne: id }
      });
      if (existingCategory) {
        throw new AppError('Category with this name already exists', 400);
      }
    }

    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!category) {
      throw new AppError('No category found with that ID', 404);
    }

    return category;
  }

  /**
   * Xóa category
   */
  public static async deleteCategory(id: string) {
    // Kiểm tra xem có bài viết nào đang sử dụng category này không
    const postsCount = await Post.countDocuments({ categories: id });
    if (postsCount > 0) {
      throw new AppError(
        'Cannot delete category because it is being used by posts',
        400
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new AppError('No category found with that ID', 404);
    }

    return { message: 'Category deleted successfully' };
  }

  /**
   * Lấy danh sách bài viết trong một category
   */
  public static async getCategoryPosts(categoryId: string, query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ categories: categoryId })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email')
      .populate('categories', 'name')
      .populate('tags', 'name');

    const total = await Post.countDocuments({ categories: categoryId });

    return {
      posts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }
} 