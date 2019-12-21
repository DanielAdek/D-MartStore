import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReviewSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  username: {
    type: String,
    trim: true,
    default: 'Anonymus'
  },
  email: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    trim: true,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQstdTNjhaUfy_tu_qrbawsAFJuOWrqJLzLnjjdB9P4oSeyJabX5w&s'
  },
  review: {
    type: String,
    trim: true,
    required: 'Review is required'
  }
},
{
  timestamps: true
});

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
