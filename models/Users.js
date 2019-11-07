/* eslint-disable func-names */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: 'User Name is required'
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: 'Email is required'
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true,
    required: 'password is required'
  },
  role: String,
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: {
    type: String,
    trim: true
  },
  resetPasswordExpire: Date,
},
{
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    next();
  }
});

/* eslint-disable */
userSchema.methods.comparePassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.methods.toJSON = function () {
  const _user = this.toObject();
  delete _user.password;
  delete _user.__v;
  return _user;
};

const User = mongoose.model('User', userSchema);

export default User;
