import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';

dotenv.config();

const offlineServices = [
  {
    name: "Hydrotherapy",
    category: "offline",
    description: "Water-based therapy using temperature and pressure to relieve pain and promote physical healing.",
    price: 50,
    duration: 45
  },
  {
    name: "Mud therapy",
    category: "offline",
    description: "Application of therapeutic mud to detoxify the body and rejuvenate the skin.",
    price: 40,
    duration: 45
  },
  {
    name: "Massage therapy",
    category: "offline",
    description: "Deep tissue and relaxing massages to relieve tension and improve circulation.",
    price: 80,
    duration: 60
  },
  {
    name: "Detox and cleansing treatments",
    category: "offline",
    description: "Comprehensive bodily cleanse focusing on eliminating toxins and resetting digestive health.",
    price: 120,
    duration: 90
  },
  {
    name: "Yoga sessions",
    category: "offline",
    description: "Guided physical postures and breathing techniques to enhance flexibility and peace.",
    price: 20,
    duration: 60
  },
  {
    name: "Meditation classes",
    category: "offline",
    description: "Guided mindfulness practices to bring calmness, clarity, and stress relief.",
    price: 15,
    duration: 45
  },
  {
    name: "Diet consultation",
    category: "offline",
    description: "Personalized dietary planning and nutritional advice tailored to your goals.",
    price: 30,
    duration: 30
  },
  {
    name: "Lifestyle correction programs",
    category: "offline",
    description: "Holistic coaching aiming to replace unhelpful habits with sustainable lifestyle routines.",
    price: 60,
    duration: 60
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected for seeding.');

    // Seed new offline services
    for (const srv of offlineServices) {
      const existing = await Service.findOne({ name: srv.name });
      if (!existing) {
        await Service.create(srv);
        console.log(`Created: ${srv.name}`);
      } else {
        console.log(`Already exists: ${srv.name}`);
      }
    }

    console.log('Seeding completed!');
    process.exit();
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
