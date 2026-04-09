import express from 'express';
import { getAIAdvice } from '../controllers/aiController.js';

const router = express.Router();

router.post('/advise', getAIAdvice);

export default router;
