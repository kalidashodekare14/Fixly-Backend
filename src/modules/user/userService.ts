import User from '../../models/user';
import IUser from '../../types/user';

type UpdateUserDTO = {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  image?: string;
};

const getNavbarProfile = async (userId: string) => {
  const user = await User.findById(userId).select('image role name');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const userInfo = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateUserInfo = async (userId: string, updateData: UpdateUserDTO) => {
  const updatePayload = Object.fromEntries(
    Object.entries(updateData).filter(
      ([_, value]) => value !== undefined && value !== null,
    ),
  );

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: updatePayload,
    },
    {
      returnDocument: 'after',
    },
  );
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export { getNavbarProfile, userInfo, updateUserInfo };
