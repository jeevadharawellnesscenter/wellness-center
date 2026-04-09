import mongoose from 'mongoose';

const diarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: String,
    enum: ['Excellent', 'Good', 'Neutral', 'Tired', 'Stressed'],
    required: true
  },
  physicalState: {
    type: String,
    enum: ['Energetic', 'Balanced', 'Low Energy', 'In Pain', 'Relaxed'],
    required: true
  },
  notes: {
    type: String,
    maxLength: [500, 'Notes cannot be more than 500 characters']
  },
  waterIntake: {
    type: Number, // in liters
    default: 0
  },
  sleepHours: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Diary = mongoose.model('Diary', diarySchema);
export default Diary;
