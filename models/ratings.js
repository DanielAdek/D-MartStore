import mongoose from 'mongoose';

const { Schema } = mongoose;

const RatingSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  rating: {
    type: Number,
    default: 5
  }
},
{
  timestamps: true
});

const Rating = mongoose.model('Rating', RatingSchema);

export default Rating;
