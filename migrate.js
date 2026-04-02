import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/Service.js';

dotenv.config();

const onlineServicesNames = [
  "Online yoga sessions", "Virtual consultation", "Personalized diet plans",
  "Lifestyle coaching", "Stress management sessions"
];

const migrateDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected for migration.');

    // Fetch all services
    const services = await Service.find({});

    for (const srv of services) {
      if (onlineServicesNames.includes(srv.name)) {
        srv.category = 'online';
      } else {
        srv.category = 'offline';
      }

      // We also bypass validation for old enums if any exist, save directly 
      // but findByIdAndUpdate ensures we bypass schema strictness during the transition
      await Service.findByIdAndUpdate(srv._id, { category: srv.category }, { runValidators: false });
      console.log(`Updated ${srv.name} -> ${srv.category}`);
    }

    console.log('Migration completed!');
    process.exit();
  } catch (error) {
    console.error('Error migrating DB:', error);
    process.exit(1);
  }
};

migrateDB();
