/* eslint-disable func-names */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  recipientName: {
    type: String,
    trim: true,
    required: 'Recipient name is required'
  },
  recipientDeliveryAdr: {
    type: String,
    trim: true,
    required: 'Delivery address is required'
  },
  recipientEmail: {
    type: String,
    trim: true,
  },
  recipientPhoneNumber: {
    type: String,
    trim: true
  },
  recipientOrderNote: {
    type: String,
    trim: true
  },
  sumTotalOrdersPrice: Number,
  orderPaymentOption: String,
  paymentStatus: { type: String, default: 'pending' },
  orderStatus: {
    type: String,
    default: 'pending'
  },
},
{
  timestamps: true
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
