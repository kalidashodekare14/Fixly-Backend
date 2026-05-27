import provider from '../../models/provider';
import { IProviderUpdate } from '../../types/provider';
import user from '../../models/user';
import Offer from '../../models/offer';

interface IUserData {
  name?: string;
  email?: string;
  phone?: string;
}

interface IOfferCreateData {
  requestId: string;
  offeredPrice?: number;
  message?: string;
  estimatedTime?: Date;
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

const requestInfo = async (userId: string) => {
  const providerData = await provider.findOne({ user: userId });

  if (!providerData) {
    throw new Error('Provider not found');
  }

  const offers = await Offer.find({
    provider: providerData._id,
  }).populate('request');

  // clean response (hide internal status if needed)
  const cleanedOffers = offers.map((offer) => {
    const { __v, ...rest } = offer.toObject();
    return rest;
  });

  return cleanedOffers;
};

const offerCreate = async (userId: string, data: IOfferCreateData) => {
  const providerData = await provider.findOne({ user: userId });

  if (!providerData) {
    throw new Error('Provider not found');
  }

  const existingOffer = await Offer.findOne({
    provider: providerData._id,
    request: data.requestId,
  });

  if (existingOffer?.status === 'accepted') {
    throw new Error('Offer already accepted, cannot update');
  }

  const offer = await Offer.findOneAndUpdate(
    {
      provider: providerData._id,
      request: data.requestId,
    },
    {
      $set: {
        ...(data.offeredPrice !== undefined && {
          offeredPrice: data.offeredPrice,
        }),
        ...(data.message && { message: data.message }),
        ...(data.estimatedTime && {
          estimatedTime: data.estimatedTime,
        }),
        status: 'offered',
      },

      $setOnInsert: {
        provider: providerData._id,
        request: data.requestId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return offer;
};

export { providerInfo, providerInfoUpdate, requestInfo, offerCreate };
