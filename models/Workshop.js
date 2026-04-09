import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  date: {
    type: Date,
    required: [true, 'Please add a workshop date']
  },
  time: {
    type: String,
    required: [true, 'Please add a workshop time']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please add duration']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800'
  },
  isMemberOnly: {
    type: Boolean,
    default: true
  },
  meetLink: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Workshop = mongoose.model('Workshop', workshopSchema);
export default Workshop;
