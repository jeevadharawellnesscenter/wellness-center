import Practitioner from '../models/Practitioner.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all practitioners
// @route   GET /api/practitioners
// @access  Public
export const getPractitioners = async (req, res) => {
  try {
    const practitioners = await Practitioner.find().populate('services', 'name category');
    res.json({ success: true, count: practitioners.length, data: practitioners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single practitioner
// @route   GET /api/practitioners/:id
// @access  Public
export const getPractitioner = async (req, res) => {
  try {
    const practitioner = await Practitioner.findById(req.params.id).populate('services');
    if (!practitioner) {
      return res.status(404).json({ success: false, message: 'Practitioner not found' });
    }
    res.json({ success: true, data: practitioner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create practitioner
// @route   POST /api/practitioners
// @access  Private/Admin
export const createPractitioner = async (req, res) => {
  try {
    const practitioner = await Practitioner.create(req.body);
    
    await ActivityLog.create({
      user: req.user._id,
      userEmail: req.user.email,
      action: 'PRACTITIONER_CREATE',
      description: `Admin added practitioner: ${practitioner.name}`
    });

    res.status(201).json({ success: true, data: practitioner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update practitioner
// @route   PUT /api/practitioners/:id
// @access  Private/Admin
export const updatePractitioner = async (req, res) => {
  try {
    let practitioner = await Practitioner.findById(req.params.id);
    if (!practitioner) {
      return res.status(404).json({ success: false, message: 'Practitioner not found' });
    }

    practitioner = await Practitioner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: practitioner });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete practitioner
// @route   DELETE /api/practitioners/:id
// @access  Private/Admin
export const deletePractitioner = async (req, res) => {
  try {
    const practitioner = await Practitioner.findById(req.params.id);
    if (!practitioner) {
      return res.status(404).json({ success: false, message: 'Practitioner not found' });
    }

    await practitioner.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
