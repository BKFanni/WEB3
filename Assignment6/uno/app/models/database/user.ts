import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export async function comparePasswordAsync(
  user: {
      username: string;
      password: string;
  } & {
      _id: Types.ObjectId;
  } & {
      __v: number;
  },
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, user.password)
}

// Compare password method for login
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);