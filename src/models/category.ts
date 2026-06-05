import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
  },
  label: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
