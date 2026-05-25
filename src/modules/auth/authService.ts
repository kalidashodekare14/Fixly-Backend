// External dependencies
import generateToken from '../../utils/tokenService';

// Internal dependencies
import IUser from '../../types/user';
import User from '../../models/user';

const registerUser = async (userData: IUser) => {
  const { name, email, password, role } = userData;
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }
  // save user data
  const newUser = await User.create({ name, email, password, role });
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

export { registerUser, loginUser };
