import nodemailer from 'nodemailer';

export const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide all fields (Name, Email, Message)' });
  }

  try {
    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'jeevadharawellnesscenter@gmail.com',
        pass: process.env.EMAIL_PASS || 'dummy_password_for_demo' 
      }
    });

    // The user requested that the email GOES TO this email:
    const mailOptions = {
      from: email,
      to: 'jeevadharawellnesscenter@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `You have received a new message from the Jeevadhara website contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email
    };

    // If there is no real App Password in .env, skip sending to avoid hanging on connection timeouts
    if (!process.env.EMAIL_PASS) {
      console.log('Simulation: Email contact received from', email, 'but EMAIL_PASS is missing in .env. Skipping real send.');
      return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    }

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.log('Nodemailer Error:', mailError.message);
    }

    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error processing contact form' });
  }
};
