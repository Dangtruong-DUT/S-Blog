import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import envConfig from './env.config';

// Cấu hình cloudinary
cloudinary.config({
  cloud_name: envConfig.CLOUD_NAME,
  api_key: envConfig.CLOUD_API_KEY,
  api_secret: envConfig.CLOUD_API_SECRET,
});

// Cấu hình storage cho multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 's-blog',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  } as any,
});

// Cấu hình upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Kiểm tra file type
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Chỉ cho phép upload ảnh'));
    }
    cb(null, true);
  },
});

// Xóa ảnh trên cloudinary
const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    console.error('Error deleting image:', error.message);
    throw new Error('Error deleting image');
  }
};

export { upload, deleteImage }; 