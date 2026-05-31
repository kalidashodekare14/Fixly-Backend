import provider from '../../models/provider';
import { IProviderUpdate } from '../../types/provider';
import user from '../../models/user';
import Offer from '../../models/offer';
import Request from '../../models/request';

interface IUserData {
  image?: string;
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
    .populate('user', 'name email phone image role');

  return providerData;
};

const providerInfoUpdate = async (userId: string, data: IProviderUpdate) => {
  const userData: IUserData = {};
  const providerData: IProviderUpdate = {};

  // ----------------------USER-----------------------
  if (data.name) userData.name = data.name;
  if (data.email) userData.email = data.email;
  if (data.phone) userData.phone = data.phone;
  if (data.image) userData.image = data.image;

  // ----------------------PROVIDER-----------------------

  if (data.services) {
    try {
      providerData.services =
        typeof data.services === 'string'
          ? JSON.parse(data.services)
          : data.services;
    } catch {
      providerData.services = [];
    }
  }
  if (data.location) providerData.location = data.location;

  if (data.bio) providerData.bio = data.bio;

  if (typeof data.availableStatus === 'boolean') {
    providerData.availableStatus = data.availableStatus;
  }

  if (data.location) {
    providerData.location = data.location;
  }

  if (data.rate !== undefined) {
    const rate = Number(data.rate);
    if (!isNaN(rate)) providerData.rate = rate;
  }

  if (data.rateType) providerData.rateType = data.rateType;

  // ---------------- UPDATE USER ----------------
  if (Object.keys(userData).length > 0) {
    await user.findByIdAndUpdate(userId, userData, { new: true });
  }

  // ---------------- UPDATE PROVIDER ----------------
  let updatedProvider = null;

  if (Object.keys(providerData).length > 0) {
    updatedProvider = await provider.findOneAndUpdate(
      { user: userId },
      providerData,
      { new: true },
    );
  }

  return updatedProvider;
};

const requestInfo = async (userId: string) => {
  const providerData = await provider.findOne({ user: userId });

  if (!providerData) {
    throw new Error('Provider not found');
  }

  const offers = await Offer.find({
    provider: providerData._id,
    status: 'pending',
  }).populate({
    path: 'request',
    populate: {
      path: 'user',
      select: 'name image',
    },
  });

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

const offeredInfo = async (userId: string) => {
  const providerData = await provider.findOne({ user: userId });

  if (!providerData) {
    throw new Error('Provider not found');
  }

  const offers = await Offer.find({
    provider: providerData._id,
    status: 'offered',
  }).populate({
    path: 'request',
    populate: {
      path: 'user',
      select: 'name image',
    },
  });

  // clean response (hide internal status if needed)
  const cleanedOffers = offers.map((offer) => {
    const { __v, ...rest } = offer.toObject();
    return rest;
  });

  return cleanedOffers;
};

const providerJobsInfo = async (userId: string) => {
  const providerData = await provider.findOne({ user: userId });

  if (!providerData) {
    throw new Error('Provider not found');
  }

  const jobsData = await Offer.find({
    provider: providerData._id,
    status: 'accepted',
  }).populate({
    path: 'request',
    populate: {
      path: 'user',
      select: 'name image',
    },
  });

  // clean response (hide internal status if needed)
  const cleanedJobs = jobsData.map((offer) => {
    const { __v, ...rest } = offer.toObject();
    return rest;
  });

  return cleanedJobs;
};

const jobStatusChange = async (userId: string, data: any) => {
  const providerData = await provider.findOne({ user: userId });

  if (!providerData) {
    throw new Error('Provider not found');
  }

  const jobsData = await Offer.findOne({
    _id: data.jobId,
    provider: providerData._id,
    status: 'accepted',
  }).populate('request');

  if (!jobsData) {
    throw new Error('Job not found');
  }

  await Request.findByIdAndUpdate(
    jobsData.request._id,
    {
      status: data.status,
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  );
};

export {
  providerInfo,
  providerInfoUpdate,
  requestInfo,
  offerCreate,
  offeredInfo,
  providerJobsInfo,
  jobStatusChange,
};
