import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudnary url
      require: true,
    },
    coverImage: {
      type: String, // cloudnary url
    },
    watchHistory: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//BCRYPT PASSWORD
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//METHOD TO CHECK THE PASSWORD
userSchema.method.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//JWT

userSchema.method.gererateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SCERET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.method.gererateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model('User', userSchema);
