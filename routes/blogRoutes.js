import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage
} from '../controllers/blogController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, WEBP images are allowed'));
    }
    cb(null, true);
  }
});

router.route('/')
  .get(getBlogs)
  .post(protect, admin, createBlog);

router.post('/upload-image', protect, admin, upload.single('image'), uploadBlogImage);

router.route('/:id')
  .get(getBlog)
  .put(protect, admin, updateBlog)
  .delete(protect, admin, deleteBlog);

export default router;
