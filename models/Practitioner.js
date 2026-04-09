import mongoose from 'mongoose';

const practitionerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Please add a specialization']
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio'],
    maxLength: [1000, 'Bio cannot be more than 1000 characters']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559839734-2b71f1e3b770?q=80&w=800'
  },
  services: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Service'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Practitioner = mongoose.model('Practitioner', practitionerSchema);
export default Practitioner;
