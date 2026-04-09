import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import ActivityLog from '../models/ActivityLog.js';
import Service from '../models/Service.js';
import Practitioner from '../models/Practitioner.js';
import Blog from '../models/Blog.js';
import Newsletter from '../models/Newsletter.js';

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

    const allUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(20);

    res.render('pages/admin-dashboard', {
      title: 'Admin Dashboard',
      user: req.user,
      stats: {
        usersCount,
        appointmentsCount,
        activitiesCount
      },
      recentActivities,
      recentAppointments,
      allUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
// @desc    Get admin services page
// @route   GET /admin/services
// @access  Private/Admin
export const getAdminServices = async (req, res) => {
  try {
    const services = await Service.find().populate('practitioner', 'name');
    const practitioners = await Practitioner.find().select('name');
    res.render('pages/admin-services', {
      title: 'Manage Services',
      user: req.user,
      services,
      practitioners
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// @desc    Get admin blogs page
// @route   GET /admin/blogs
// @access  Private/Admin
export const getAdminBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishDate: -1 });
    res.render('pages/admin-blogs', {
      title: 'Manage Blogs',
      user: req.user,
      blogs
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// @desc    Get admin practitioners page
// @route   GET /admin/practitioners
// @access  Private/Admin
export const getAdminPractitioners = async (req, res) => {
  try {
    const practitioners = await Practitioner.find();
    res.render('pages/admin-practitioners', {
      title: 'Manage Practitioners',
      user: req.user,
      practitioners
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// @desc    Get admin subscribers page
// @route   GET /admin/subscribers
// @access  Private/Admin
export const getAdminSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.render('pages/admin-subscribers', {
      title: 'Manage Subscribers',
      user: req.user,
      subscribers
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
