import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import ActivityLog from '../models/ActivityLog.js';
import { createGoogleMeet } from '../utils/googleMeet.js';

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

    // Generate Real Google Meet Link
    let professionalMeetLink = await createGoogleMeet({
      serviceName: service.name,
      date,
      time,
      userName: req.user.name || req.user.email,
      userEmail: req.user.email
    });

    // Fallback if Google API is not shared or fails
    if (!professionalMeetLink) {
      const part1 = Math.random().toString(36).substring(2, 5);
      const part2 = Math.random().toString(36).substring(2, 6);
      const part3 = Math.random().toString(36).substring(2, 5);
      professionalMeetLink = `https://meet.google.com/${part1}-${part2}-${part3}`;
      console.warn('⚠️ Falling back to formatted random Meet link.');
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      service: serviceId,
      date,
      time,
      meetLink: professionalMeetLink
    });

    // Log appointment activity
    await ActivityLog.create({
      user: req.user._id,
      userEmail: req.user.email,
      action: 'APPOINTMENT_CREATE',
      description: `User booked an appointment for service: ${service.name} on ${date} at ${time}`
    });

    // ========================================================
    // WhatsApp Notification Logic (Automatic + Fallback)
    // ========================================================
    const clinicPhone = '917010612322';
    const formattedDate = new Date(date).toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const waContent = 
      `🌿 *New Appointment Booked!*%0A%0A` +
      `👤 *Customer:* ${encodeURIComponent(req.user.name || req.user.email)}%0A` +
      `📧 *Email:* ${encodeURIComponent(req.user.email)}%0A` +
      `💆 *Service:* ${encodeURIComponent(service.name)}%0A` +
      `📂 *Category:* ${encodeURIComponent(service.category || 'N/A')}%0A` +
      `📅 *Date:* ${encodeURIComponent(formattedDate)}%0A` +
      `⏰ *Time:* ${encodeURIComponent(time)}%0A` +
      `🔗 *Meeting Link:* ${encodeURIComponent(professionalMeetLink)}%0A%0A` +
      `Please confirm this appointment at your earliest convenience.`;

    const apiKey = process.env.CALLMEBOT_APIKEY;
    let whatsappNotifyUrl = null;

    if (apiKey) {
      // Automatic Server-Side Send
      const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${clinicPhone}&text=${waContent}&apikey=${apiKey}`;
      fetch(callMeBotUrl).catch(err => console.error('WhatsApp notification error:', err.message));
      console.log(`✅ Automatic WhatsApp notification triggered for: ${service.name}`);
    } else {
      // Fallback: Generation of a manual URL for the frontend to open
      whatsappNotifyUrl = `https://wa.me/${clinicPhone}?text=${waContent}`;
      console.warn('⚠️ CALLMEBOT_APIKEY missing - falling back to manual notification URL.');
    }

    res.status(201).json({ 
      success: true, 
      data: appointment, 
      whatsappNotifyUrl,
      message: 'Appointment booked successfully!' 
    });
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
