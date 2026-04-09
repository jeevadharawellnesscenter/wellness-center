import express from 'express';
import { 
  getAdminDashboard, 
  getAdminServices, 
  getAdminBlogs, 
  getAdminPractitioners, 
  getAdminSubscribers 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Dashboard Route
router.get('/', protect, admin, getAdminDashboard);
router.get('/services', protect, admin, getAdminServices);
router.get('/blogs', protect, admin, getAdminBlogs);
router.get('/practitioners', protect, admin, getAdminPractitioners);
router.get('/subscribers', protect, admin, getAdminSubscribers);

export default router;
