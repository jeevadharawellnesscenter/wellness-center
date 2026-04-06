import express from 'express';
import { getAdminDashboard } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Dashboard Route
router.get('/', protect, admin, getAdminDashboard);

export default router;
