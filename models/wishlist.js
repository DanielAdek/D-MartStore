import mongoose from 'mongoose';

const { Schema } = mongoose;

const WishListSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  wishlistcode: {
    type: String,
    trim: true
  },
  recentWish: {
    type: Boolean,
    default: true
  },
},
{
  timestamps: true
});

const WishList = mongoose.model('WishList', WishListSchema);

export default WishList;
