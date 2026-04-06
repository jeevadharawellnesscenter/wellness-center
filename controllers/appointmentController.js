import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private
export const bookAppointment = async (req, res) => {
  try {
    const { serviceId, date, time } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      service: serviceId,
      date,
      time,
      meetLink: `https://meet.google.com/stub-${Math.random().toString(36).substring(7)}` // Auto-generate stub meet link
    });

    // Log appointment activity
    await ActivityLog.create({
      user: req.user._id,
      userEmail: req.user.email,
      action: 'APPOINTMENT_CREATE',
      description: `User booked an appointment for service ID: ${serviceId} on ${date} at ${time}`
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user appointments
// @route   GET /api/appointments/myappointments
// @access  Private
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('service', 'name category duration')
      .lean();

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email phone')
      .populate('service', 'name category');

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private/Admin
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, meetLink } = req.body;

    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status || appointment.status;
    if (meetLink) appointment.meetLink = meetLink;

    await appointment.save();

    // Log appointment update activity
    await ActivityLog.create({
      user: appointment.user,
      action: 'APPOINTMENT_UPDATE',
      description: `Appointment ${appointment._id} status updated to ${appointment.status}`
    });

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
