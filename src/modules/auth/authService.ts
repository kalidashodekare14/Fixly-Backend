import crypto from 'crypto';
import axios from 'axios';
import generateToken from '../../utils/tokenService';
import IUser from '../../types/user';
import User from '../../models/user';
import Provider from '../../models/provider';

const googleLogin = async (userData: {
  googleId: string;
  name: string;
  email: string;
  image?: string;
}) => {
  const { googleId, name, email, image } = userData;

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    user.googleId = googleId;
    user.name = name;
    if (image) user.image = image;
    await user.save();
  } else {
    const placeholderPassword = crypto.randomBytes(20).toString('hex');
    user = await User.create({
      googleId,
      name,
      email,
      image,
      password: placeholderPassword,
    });
  }

  const token = generateToken({ id: user._id.toString() });

  const userObject = user.toObject();
  delete (userObject as { password?: string }).password;

  return { user: userObject, token };
};

const registerUser = async (userData: IUser) => {
  const { name, email, password, role } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }
  const newUser = await User.create({ name, email, password, role });

  if (role === 'provider') {
    await Provider.create({ user: newUser._id });
  }

  return newUser;
};

const loginUser = async (userData: IUser) => {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken({ id: user._id.toString() });

  const userObject = user.toObject();
  delete (userObject as { password?: string }).password;

  return { user: userObject, token };
};

export { registerUser, loginUser, googleLogin };
