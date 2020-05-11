/* eslint-disable func-names */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReviewSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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

const RatingSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
    default: 5
  }
},
{
  timestamps: true
});

const ProductSchema = new Schema({
  ownersId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productName: {
    type: String,
    trim: true,
    required: 'Product Name is required'
  },
  productPrice: {
    type: Number,
    trim: true,
    required: 'Product price is required'
  },
  productDescription: {
    type: String,
    trim: true,
  },
  productColor: String,
  productTag: String,
  productCode: String,
  productImages: [{ image: { type: String, trim: true }, id: { type: Number } }],
  productStatus: { type: String, default: 'In-Stock' },
  productBrand: {
    type: String,
    trim: true
  },
  productCategory: String,
  productDemandStatus: String,
  productCaptionHeading: {
    type: String,
    trim: true
  },
  ratings: [RatingSchema],
  reviews: [ReviewSchema],
  onOrderCount: { type: Number, default: 0 },
  inCartCount: { type: Number, default: 0 },
  lastUserEdited: Schema.Types.ObjectId
},
{
  timestamps: true
});

ProductSchema.index({
  productName: 'text',
  productBrand: 'text',
  productPrice: 'text',
  productTag: 'text',
  productCategory: 'text',
  productCaptionHeading: 'text'
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
