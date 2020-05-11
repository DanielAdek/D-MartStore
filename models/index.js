import mongoose from 'mongoose';
import { config } from 'dotenv';
import Users from './Users';
import Products from './products';
import Karts from './kart';
import Orders from './order';
import Reviews from './review';
import WishLists from './wishlist';
import Ratings from './ratings';

config();

const options = {
  keepAlive: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose
  .connect(
    process.env.DB_URI,
    options
  ).then(() => console.log('Mongodb connected!'));

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
} else {
  mongoose.set('debug', false);
}
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

export default {
  Users, Products, Karts, Orders, Reviews, WishLists, Ratings
};
