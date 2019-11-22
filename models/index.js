import mongoose from 'mongoose';
import { config } from 'dotenv';
import Users from './Users';
import Products from './products';
import Karts from './kart';
import Orders from './order';

config();

const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
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
  )
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Mongodb connected!');
    }
  });

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
} else {
  mongoose.set('debug', false);
}
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

export default {
  Users, Products, Karts, Orders
};
