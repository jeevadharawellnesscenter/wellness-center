import express from 'express';
import {
  bookAppointment,
  getMyAppointments,
  getAppointments,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, bookAppointment)
  .get(protect, admin, getAppointments);

router.route('/myappointments')
  .get(protect, getMyAppointments);

router.route('/:id')
  .put(protect, admin, updateAppointmentStatus);

export default router;
