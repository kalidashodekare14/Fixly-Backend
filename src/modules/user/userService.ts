import User from '../../models/user';
import IUser from '../../types/user';

const userInfo = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateUserInfo = async (userId: string, updateData: IUser) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export { userInfo, updateUserInfo };
