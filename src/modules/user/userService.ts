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
  const updatePayload = Object.fromEntries(
    Object.entries(updateData).filter(
      ([_, value]) => value !== undefined && value !== null,
    ),
  );

  const user = await User.findByIdAndUpdate(userId, updatePayload, {
    new: true,
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export { userInfo, updateUserInfo };
