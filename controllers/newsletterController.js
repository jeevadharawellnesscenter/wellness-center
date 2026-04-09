import Newsletter from '../models/Newsletter.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if already subscribed
    let subscriber = await Newsletter.findOne({ email });
    
    if (subscriber) {
      if (subscriber.isActive) {
        return res.status(400).json({ success: false, message: 'Email already subscribed' });
      } else {
        subscriber.isActive = true;
        await subscriber.save();
        return res.status(200).json({ success: true, message: 'Resubscribed successfully' });
      }
    }

    subscriber = await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
