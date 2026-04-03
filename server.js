import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import expressLayouts from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Load env vars
dotenv.config();

// Connect Database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors());

// EJS Layouts & View Engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

import { protect } from './middleware/authMiddleware.js';

// Set global variable for logged in user info
app.use(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token && token !== 'none') {
    try {
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
      // We will lazily load user or pass decoding to views. For now just passing id.
      res.locals.user = { _id: decoded.id };
    } catch (err) { }
  } else {
    res.locals.user = null;
  }

  res.locals.currentPath = req.path;
  next();
});

// Import Routes (To be created)
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Will be simple or reuse auth routes
import serviceRoutes from './routes/serviceRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

// View Routes Setup
app.get('/', (req, res) => res.render('pages/index', { title: 'Home' }));
app.get('/about', (req, res) => res.render('pages/about', { title: 'About Us' }));
app.get('/services', (req, res) => res.render('pages/services', { title: 'Premium Services' }));
app.get('/services/offline', (req, res) => res.render('pages/services/offline', { title: 'Offline Services' }));
app.get('/services/online', (req, res) => res.render('pages/services/online', { title: 'Online Services' }));
app.get('/contact', (req, res) => res.render('pages/contact', { title: 'Contact' }));
app.get('/login', (req, res) => res.render('pages/login', { title: 'Login' }));
app.get('/register', (req, res) => res.render('pages/register', { title: 'Register' }));
app.get('/dashboard', protect, (req, res) => res.render('pages/dashboard', { title: 'User Dashboard', user: req.user }));
app.get('/profile', protect, (req, res) => res.render('pages/profile', { title: 'Profile Settings', user: req.user }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

