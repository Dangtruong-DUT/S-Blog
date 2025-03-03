import { Request, Response } from 'express';
import Schedule from '@/models/Schedule';
import Post from '@/models/Post';
import { sendNotification } from '@/services/notification.service';

export const schedulePost = async (req: Request, res: Response) => {
  try {
    const { postId, scheduledDate } = req.body;
    const userId = req.user._id;

    // Kiểm tra bài viết tồn tại
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Kiểm tra quyền
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Tạo lịch đăng bài
    const schedule = new Schedule({
      post: postId,
      author: userId,
      scheduledDate: new Date(scheduledDate)
    });

    await schedule.save();

    res.status(201).json(schedule);
  } catch (error) {
    console.error('Schedule post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getScheduledPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const schedules = await Schedule.find({ author: userId })
      .populate('post')
      .sort({ scheduledDate: 1 });

    res.json(schedules);
  } catch (error) {
    console.error('Get scheduled posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const { scheduleId } = req.params;
    const { scheduledDate } = req.body;
    const userId = req.user._id;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    if (schedule.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    schedule.scheduledDate = new Date(scheduledDate);
    await schedule.save();

    res.json(schedule);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const { scheduleId } = req.params;
    const userId = req.user._id;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    if (schedule.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await schedule.deleteOne();
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Hàm này sẽ được gọi bởi cron job
export const publishScheduledPosts = async () => {
  try {
    const now = new Date();
    const schedules = await Schedule.find({
      scheduledDate: { $lte: now },
      status: 'pending'
    }).populate('post');

    for (const schedule of schedules) {
      try {
        const post = schedule.post as any;
        post.status = 'published';
        post.publishedAt = now;
        await post.save();

        schedule.status = 'published';
        await schedule.save();

        // Gửi thông báo
        await sendNotification(schedule.author, {
          type: 'post_published',
          title: 'Bài viết đã được đăng',
          message: `Bài viết "${post.title}" đã được đăng thành công`,
          data: { postId: post._id }
        });
      } catch (error) {
        console.error(`Failed to publish post ${schedule.post}:`, error);
        schedule.status = 'failed';
        await schedule.save();
      }
    }
  } catch (error) {
    console.error('Publish scheduled posts error:', error);
  }
}; 