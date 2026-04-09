import express from 'express';
import {
  getPractitioners,
  getPractitioner,
  createPractitioner,
  updatePractitioner,
  deletePractitioner
} from '../controllers/practitionerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPractitioners)
  .post(protect, admin, createPractitioner);

router.route('/:id')
  .get(getPractitioner)
  .put(protect, admin, updatePractitioner)
  .delete(protect, admin, deletePractitioner);

export default router;
