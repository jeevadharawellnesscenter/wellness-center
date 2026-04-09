import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  excerpt: {
    type: String,
    required: [true, 'Please add an excerpt'],
    maxLength: [300, 'Excerpt cannot be more than 300 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Naturopathy', 'Diet', 'Lifestyle', 'Mindfulness', 'Yoga']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800'
  },
  author: {
    type: String,
    default: 'Jeevadhara Wellness Team'
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  }
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
