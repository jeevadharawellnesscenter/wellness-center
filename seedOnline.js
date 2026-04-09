import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';

dotenv.config();

const onlineServices = [
  {
    name: "Online yoga sessions",
    category: "online",
    description: "Participate in guided yoga sessions from the comfort of your home.",
    price: 15,
    duration: 60
  },
  {
    name: "Virtual consultation",
    category: "online",
    description: "Speak directly with our experts online to discuss your health and wellness goals.",
    price: 50,
    duration: 45
  },
  {
    name: "Personalized diet plans",
    category: "online",
    description: "Receive a fully tailored nutrition plan delivered virtually to optimize your health.",
    price: 40,
    duration: 30
  },
  {
    name: "Lifestyle coaching",
    category: "online",
    description: "One-on-one virtual coaching to help you build sustainable, healthy daily habits.",
    price: 45,
    duration: 60
  },
  {
    name: "Stress management sessions",
    category: "online",
    description: "Virtual therapy focusing on techniques and practices to effectively manage and reduce stress.",
    price: 35,
    duration: 45
  },
  {
    name: "Consultation",
    category: "online",
    description: "Personalized virtual session with our experts to discuss your holistic wellness journey.",
    price: 30,
    duration: 45,
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800"
  },
  {
    name: "Counselling",
    category: "online",
    description: "Professional online mental health support and guidance for emotional well-being.",
    price: 40,
    duration: 60,
    image: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?q=80&w=800"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected for seeding online services.');

    for (const srv of onlineServices) {
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
