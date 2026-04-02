import express from 'express';
import { createCheckoutSession, paymentSuccess, paymentCancel } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/success', paymentSuccess);
router.get('/cancel', paymentCancel);

export default router;
