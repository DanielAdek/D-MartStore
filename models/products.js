/* eslint-disable func-names */
import mongoose from 'mongoose';

const { Schema } = mongoose;

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
  productImages: [{ image: { type: String, trim: true } }],
  productStatus: String,
  productBrand: String,
  productCategory: String,
  productDemandStatus: String,
  productCaptionHeading: String,
  onOrderCount: { type: Number, default: 0 },
  inCartCount: { type: Number, default: 0 },
  lastUserEdited: Schema.Types.ObjectId
},
{
  timestamps: true
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
