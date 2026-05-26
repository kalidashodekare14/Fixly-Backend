import provider from '../../models/provider';
import { IProviderUpdate } from '../../types/provider';
import user from '../../models/user';

interface IUserData {
  name?: string;
  email?: string;
  phone?: string;
}

const providerInfo = async (providerId: string) => {
  const providerData = await provider
    .findOne({
      user: providerId,
    })
    .populate('user', 'name email phone');

  return providerData;
};

const providerInfoUpdate = async (
  providerId: string,
  data: IProviderUpdate,
) => {
  // user update data
  const userData: IUserData = {};
  if (data.name) userData.name = data.name;
  if (data.email) userData.email = data.email;
  if (data.phone) userData.phone = data.phone;

  // provider update data
  const providerData: IProviderUpdate = {};
  if (data.services) providerData.services = data.services;
  if (data.experience !== undefined) providerData.experience = data.experience;
  if (data.skills) providerData.skills = data.skills;
  if (data.location) providerData.location = data.location;
  if (data.availableStatus) providerData.availableStatus = data.availableStatus;
  if (data.rate !== undefined) providerData.rate = data.rate;
  if (data.rateType) providerData.rateType = data.rateType;

  // User data to update
  await user.findByIdAndUpdate(providerId, userData, {
    returnDocument: 'after',
  });
  // Provider data to update
  const providerDataUpdate = await provider.findOneAndUpdate(
    {
      user: providerId,
    },
    providerData,
    {
      returnDocument: 'after',
    },
  );

  return providerDataUpdate;
};

export { providerInfo, providerInfoUpdate };
