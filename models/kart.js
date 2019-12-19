import mongoose from 'mongoose';

const { Schema } = mongoose;

const KartSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  imageType: {
    type: Number,
    default: 1,
  },
  quantity: {
    type: Number,
    default: 1,
    required: 'Quantity is required'
  },
  cummulativePrice: {
    type: Number,
    default: 0
  },
  kartCode: {
    type: String,
    trim: true
  },
  recentKart: { type: Boolean, default: true }
},
{
  timestamps: true
});

const Kart = mongoose.model('Kart', KartSchema);

export default Kart;
