import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import ActivityLog from '../models/ActivityLog.js';
import Service from '../models/Service.js';

// @desc    Get admin dashboard data
// @route   GET /admin
// @access  Private/Admin
export const getAdminDashboard = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const appointmentsCount = await Appointment.countDocuments();
    const activitiesCount = await ActivityLog.countDocuments();
    
    const recentActivities = await ActivityLog.find()
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .limit(10);
      
    const recentAppointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('service', 'name category')
      .sort({ date: -1 })
      .limit(5);

    res.render('pages/admin-dashboard', {
      title: 'Admin Dashboard',
      user: req.user,
      stats: {
        usersCount,
        appointmentsCount,
        activitiesCount
      },
      recentActivities,
      recentAppointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
