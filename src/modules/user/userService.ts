import User from '../../models/user';

const userInfo = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export { userInfo };
