import nodemailer from 'nodemailer';
import { env } from '@/config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});

export class EmailService {
  static async sendPasswordResetEmail(email: string, resetToken: string) {
    try {
      const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      await transporter.sendMail({
        from: `"S-Blog" <${env.SMTP_USER}>`,
        to: email,
        subject: 'Đặt lại mật khẩu',
        html: `
          <h1>Đặt lại mật khẩu</h1>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Link này sẽ hết hạn sau 1 giờ.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        `
      });
    } catch (error) {
      console.error('Send email error:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  static async sendWelcomeEmail(email: string, username: string) {
    try {
      await transporter.sendMail({
        from: `"S-Blog" <${env.SMTP_USER}>`,
        to: email,
        subject: 'Chào mừng bạn đến với S-Blog',
        html: `
          <h1>Chào mừng ${username}!</h1>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại S-Blog.</p>
          <p>Chúc bạn có những trải nghiệm tuyệt vời!</p>
        `
      });
    } catch (error) {
      console.error('Send email error:', error);
      // Không throw error vì đây không phải email quan trọng
    }
  }
} 