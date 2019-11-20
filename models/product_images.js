/* eslint-disable func-names */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProductImagesSchema = new Schema({
  ownersId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productsId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  productImages: [{ image: { type: String, trim: true } }]
},
{
  timestamps: true
});

const ProductImages = mongoose.model('Product_Images', ProductImagesSchema);

export default ProductImages;
