import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price']
  },
  originalPrice: {
    type: Number,
    default: null
  },
  discount: {
    type: Number,
    default: 0 // Discount percentage
  },
  category: {
    type: String,
    enum: ['Jerseys', 'Training', 'Training Wear', 'Accessories', 'Fan Gear', 'Footwear', 'Memorabilia', 'Other'],
    required: [true, 'Please select a category']
  },
  images: [{
    url: String,
    public_id: String // Cloudinary public_id for deletion
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate actual price after discount
productSchema.virtual('finalPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

export default mongoose.model('Product', productSchema);
