import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './models/Blog.js';
import Practitioner from './models/Practitioner.js';
import Service from './models/Service.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // Clear existing
    await Blog.deleteMany();
    await Practitioner.deleteMany();

    // Add Practitioners
    const practitioners = await Practitioner.create([
      {
        name: 'Dr. Aarav Mehta',
        specialization: 'Senior Naturopathist',
        bio: 'With over 15 years of experience in thermal healing and clinical naturopathy, Dr. Mehta leads our holistic therapy programs.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3b770?q=80&w=800'
      },
      {
        name: 'Sia Williams',
        specialization: 'Chief Yoga Instructor',
        bio: 'Sia is a certified Ashtanga yoga expert dedicated to helping clients find mental peace and physical flexibility.',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800'
      }
    ]);

    // Add Blogs
    await Blog.create([
      {
        title: 'The Silent Power of Mud Therapy',
        excerpt: 'Discover why professional mud therapy is the ultimate detoxification secret of ancient traditions.',
        content: '<p>Mud therapy is one of the five elements of nature that have a great impact on the human body. Soil has the ability to absorb various toxins from the surface of the body, which makes it very efficient in the treatment of many ailments.</p>',
        category: 'Naturopathy',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800'
      },
      {
        title: 'Morning Yoga for Mental Clarity',
        excerpt: 'Start your day with these 5 simple asanas to sharpen your focus and reduce anxiety.',
        content: '<p>Yoga is not just about physical flexibility. It is a mental discipline. Starting your day with specific asanas can significantly lower cortisol levels and prepare you for a high-performance day.</p>',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=800'
      }
    ]);

    // Link some services to practitioners
    const services = await Service.find();
    if(services.length > 0) {
        services[0].practitioner = practitioners[0]._id;
        await services[0].save();
    }

    console.log('Premium seed data added successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
