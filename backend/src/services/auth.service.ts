import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '@/config';
import { User } from '@/models/User';
import { AppError } from '@/middleware/error.middleware';
import { EmailService } from './email.service';

export class AuthService {
  /**
   * Tạo JWT token
   */
  private static createToken(userId: string): string {
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });
  }

  /**
   * Đăng ký người dùng mới
   */
  public static async register(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    // Tạo user mới
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    // Gửi email chào mừng
    await EmailService.sendWelcomeEmail(user.email, user.name);

    // Tạo token
    const token = this.createToken(user._id);

    return { user, token };
  }

  /**
   * Đăng nhập
   */
  public static async login(email: string, password: string) {
    // Tìm user và kiểm tra password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    // Tạo token
    const token = this.createToken(user._id);

    // Xóa password trước khi trả về
    user.password = undefined;

    return { user, token };
  }

  /**
   * Quên mật khẩu
   */
  public static async forgotPassword(email: string) {
    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('There is no user with that email address', 404);
    }

    // Tạo reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      // Gửi email
      await EmailService.sendPasswordResetEmail(
        user.email,
        resetToken
      );

      return { message: 'Token sent to email' };
    } catch (err) {
      // Nếu gửi email thất bại, xóa token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new AppError('There was an error sending the email. Try again later!', 500);
    }
  }

  /**
   * Đặt lại mật khẩu
   */
  public static async resetPassword(token: string, newPassword: string) {
    // Tạo hash của reset token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Tìm user với token hợp lệ
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Token is invalid or has expired', 400);
    }

    // Cập nhật password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Tạo JWT token mới
    const jwtToken = this.createToken(user._id);

    return { user, token: jwtToken };
  }

  /**
   * Cập nhật mật khẩu
   */
  public static async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    // Tìm user và kiểm tra password hiện tại
    const user = await User.findById(userId).select('+password');
    if (!user || !(await user.comparePassword(currentPassword))) {
      throw new AppError('Your current password is incorrect', 401);
    }

    // Cập nhật password
    user.password = newPassword;
    await user.save();

    // Tạo token mới
    const token = this.createToken(user._id);

    return { user, token };
  }
} 