import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true,
    maxLength: [50, 'Name can not be more than 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['online', 'offline']
  },
  location: {
    type: String,
    default: 'Jeevadhara Clinic Headquarters'
  },
  schedule: {
    type: String,
    default: 'Mon-Fri, 9:00 AM - 6:00 PM'
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxLength: [500, 'Description can not be more than 500 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in minutes']
  },
  image: {
    type: String,
    default: '/images/default-service.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
