/* eslint-disable func-names */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: [{
    itemId: { type: Schema.Types.ObjectId, ref: 'Product' },
    kartId: { type: Schema.Types.ObjectId, ref: 'Kart' }
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
  recent: { type: Boolean, default: true },
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
