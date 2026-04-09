import express from 'express';
import {
  getMyDiary,
  createDiaryEntry
} from '../controllers/diaryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyDiary)
  .post(createDiaryEntry);

export default router;
