import express from 'express';
import {
  subscribeNewsletter,
  getSubscribers
} from '../controllers/newsletterController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getSubscribers)
  .post(subscribeNewsletter);

export default router;
