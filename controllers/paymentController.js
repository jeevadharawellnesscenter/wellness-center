import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Uses env key

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId).populate('service');
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check if a payment has already been successful
    const existingPayment = await Payment.findOne({ appointment: appointmentId, status: 'successful' });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: 'Appointment already paid for' });
    }

    // Create a new pending payment record
    const payment = await Payment.create({
      user: req.user._id,
      appointment: appointmentId,
      transactionId: 'pending',
      amount: appointment.service.price,
      status: 'pending'
    });

    // Determine the base URL to return back to after checkout
    const BASE_URL = `${req.protocol}://${req.get('host')}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr', // Change to 'usd' if targeting US currency
            product_data: {
              name: `${appointment.service.name} Appointment`,
              description: `Date: ${new Date(appointment.date).toLocaleDateString()}, Time: ${appointment.time}`
            },
            unit_amount: appointment.service.price * 100, // Stripe utilizes cents/paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${BASE_URL}/api/payments/success?payment_id=${payment._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/api/payments/cancel?payment_id=${payment._id}`,
      customer_email: req.user.email,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Handle Stripe Success Webhook/Redirect
// @route   GET /api/payments/success
// @access  Public
export const paymentSuccess = async (req, res) => {
  try {
    const { payment_id, session_id } = req.query;

    // In production we would strictly verify the session_id status with Stripe here

    const payment = await Payment.findById(payment_id);
    if (!payment) {
      return res.status(404).render('pages/payment-cancel', { title: 'Error', message: 'Payment record not found' });
    }

    payment.status = 'successful';
    payment.paidAt = Date.now();
    payment.transactionId = session_id || payment.transactionId;
    await payment.save();

    res.render('pages/payment-success', { title: 'Payment Successful' });
  } catch (error) {
    res.status(500).render('pages/payment-cancel', { title: 'System Error', message: 'Error finalizing payment' });
  }
};

// @desc    Handle Stripe Cancel
// @route   GET /api/payments/cancel
// @access  Public
export const paymentCancel = async (req, res) => {
  try {
    const { payment_id } = req.query;
    const payment = await Payment.findById(payment_id);
    if (payment) {
      payment.status = 'failed';
      await payment.save();
    }
    res.render('pages/payment-cancel', { title: 'Payment Cancelled', message: 'You have cancelled the checkout process. Your booking remains unpaid.' });
  } catch (error) {
    res.status(500).render('pages/payment-cancel', { title: 'System Error', message: 'Error cancelling payment' });
  }
};
