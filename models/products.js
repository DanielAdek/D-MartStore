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
  onOrderCount: { type: Number, default: 0 },
  inCartCount: { type: Number, default: 0 },
  lastUserEdited: Schema.Types.ObjectId
},
{
  timestamps: true
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
