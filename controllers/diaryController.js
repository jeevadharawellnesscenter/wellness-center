import Diary from '../models/Diary.js';

// @desc    Get user diary entries
// @route   GET /api/diary
// @access  Private
export const getMyDiary = async (req, res) => {
  try {
    const entries = await Diary.find({ user: req.user._id }).sort({ date: -1 });
    res.json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create diary entry
// @route   POST /api/diary
// @access  Private
export const createDiaryEntry = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const entry = await Diary.create(req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
