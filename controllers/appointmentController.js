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
      description: `User booked an appointment for service: ${service.name} on ${date} at ${time}`
    });

    // ========================================================
    // AUTOMATIC WhatsApp Notification via CallMeBot API
    // The clinic owner must do ONE-TIME setup:
    //   Send "I allow callmebot to send me messages" to +34 644 59 78 49 on WhatsApp
    //   Then add the API key received to your .env as CALLMEBOT_APIKEY
    // ========================================================
    try {
      const clinicPhone = '917010612322'; // +91 70106 12322
      const apiKey = process.env.CALLMEBOT_APIKEY;

      if (apiKey) {
        const messageText = 
          `🌿 *New Appointment Booked!*%0A%0A` +
          `👤 *Customer:* ${encodeURIComponent(req.user.name || req.user.email)}%0A` +
          `📧 *Email:* ${encodeURIComponent(req.user.email)}%0A` +
          `💆 *Service:* ${encodeURIComponent(service.name)}%0A` +
          `📂 *Category:* ${encodeURIComponent(service.category || 'N/A')}%0A` +
          `📅 *Date:* ${encodeURIComponent(new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))}%0A` +
          `⏰ *Time:* ${encodeURIComponent(time)}%0A%0A` +
          `Please confirm this appointment.`;

        const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${clinicPhone}&text=${messageText}&apikey=${apiKey}`;

        // Fire and forget — don't block the response
        fetch(callMeBotUrl).catch(err => console.error('WhatsApp notification error:', err.message));

        console.log(`✅ WhatsApp notification sent to clinic for service: ${service.name}`);
      } else {
        console.warn('⚠️ CALLMEBOT_APIKEY not set in .env — WhatsApp notification skipped.');
      }
    } catch (waErr) {
      console.error('WhatsApp send error:', waErr.message);
    }

    res.status(201).json({ success: true, data: appointment, message: 'Appointment booked successfully! The clinic has been notified.' });
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
