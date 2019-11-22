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
  quantity: {
    type: Number,
    default: 1,
    required: 'Quantity is required'
  },
  cummulativePrice: {
    type: Number,
    default: 0
  }
},
{
  timestamps: true
});

const Kart = mongoose.model('Kart', KartSchema);

export default Kart;
