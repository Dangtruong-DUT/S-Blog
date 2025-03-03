import { Request, Response, NextFunction } from 'express';
import Notification from '@/models/Notification';
import { AppError } from '@/middleware/error.middleware';

// Lấy danh sách thông báo của user
export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const query = Notification.find({ recipient: req.user!._id })
      .populate('sender', 'username avatar')
      .populate('post', 'title')
      .populate('comment', 'content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const [notifications, total] = await Promise.all([
      query.exec(),
      Notification.countDocuments({ recipient: req.user!._id }),
    ]);

    // Đếm số thông báo chưa đọc
    const unreadCount = await Notification.countDocuments({
      recipient: req.user!._id,
      isRead: false,
    });

    res.json({
      status: 'success',
      results: notifications.length,
      total,
      unreadCount,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// Đánh dấu thông báo đã đọc
export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    // Kiểm tra quyền
    if (notification.recipient.toString() !== req.user!._id.toString()) {
      return next(
        new AppError('You do not have permission to mark this notification', 403)
      );
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      status: 'success',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user!._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.json({
      status: 'success',
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// Xóa thông báo
export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    // Kiểm tra quyền
    if (notification.recipient.toString() !== req.user!._id.toString()) {
      return next(
        new AppError('You do not have permission to delete this notification', 403)
      );
    }

    await notification.deleteOne();

    res.json({
      status: 'success',
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Xóa tất cả thông báo
export const deleteAllNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Notification.deleteMany({ recipient: req.user!._id });

    res.json({
      status: 'success',
      message: 'All notifications deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}; 