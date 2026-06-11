import provider from '../../models/provider';
import { IProviderUpdate } from '../../types/provider';
import user from '../../models/user';
import Offer from '../../models/offer';
import Request from '../../models/request';
import { populate } from 'dotenv';
import Provider from '../../models/provider';
import Review from '../../models/review';

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

const overviewInfo = async (userId: string) => {
  const provider = await Provider.findOne({
    user: userId,
  });

  if (!provider) {
    throw new Error('Provider not found');
  }

  const pendingRequests = await Offer.countDocuments({
    provider: provider._id,
    status: 'pending',
  });

  const activeJobs = await Request.countDocuments({
    provider: provider._id,
    status: { $in: ['assigned', 'in_progress'] },
  });

  const completedJobs = await Request.countDocuments({
    provider: provider._id,
    status: 'completed',
  });

  const completedEarnings = await Request.aggregate([
    {
      $match: {
        provider: provider._id,
        status: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$budget',
        },
      },
    },
  ]);

  const monthlyEarnings = await Request.aggregate([
    {
      $match: {
        provider: provider._id,
        status: 'completed',
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        total: {
          $sum: '$budget',
        },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
  ]);

  const months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const formated = monthlyEarnings.map((item) => ({
    month: months[item._id.month],
    amount: item.total,
  }));

  // category starts
  const categoryStats = await Request.aggregate([
    {
      $match: {
        provider: provider._id,
        status: 'completed',
      },
    },
    {
      $group: {
        _id: '$category',
        value: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: '$category',
    },
    {
      $project: {
        _id: 0,
        name: '$category.label',
        value: 1,
      },
    },
  ]);

  // recent requests
  const recentRequests = await Request.find({
    provider: provider._id,
  })
    .sort({ createdAt: 1 })
    .limit(5)
    .populate('category', 'label')
    .populate('user', 'name');

  console.log('checking recent requests', recentRequests);

  return {
    pendingRequests,
    activeJobs,
    completedJobs,
    completedEarnings: completedEarnings[0],
    monthlyEarnings: formated,
    categoryStats,
    recentRequests,
  };
};

const providerInfo = async (providerId: string) => {
  const providerData = await provider
    .findOne({
      user: providerId,
    })
    .populate('user', 'name email phone image role')
    .populate('skills', 'label');

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

  if (data.skills) {
    try {
      providerData.skills =
        typeof data.skills === 'string' ? JSON.parse(data.skills) : data.skills;
    } catch {
      providerData.skills = [];
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
    populate: [
      {
        path: 'user',
        select: 'name image',
      },
      {
        path: 'category',
        select: 'label',
      },
    ],
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

  await Request.findByIdAndUpdate(data.requestId, { status: 'open' });

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
    populate: [
      {
        path: 'user',
        select: 'name image',
      },
      {
        path: 'category',
        select: 'label',
      },
    ],
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

  const jobsData = await Request.find({
    provider: providerData._id,
    status: { $in: ['assigned', 'in_progress', 'completed'] },
  }).populate([
    {
      path: 'user',
      select: 'name image',
    },
    {
      path: 'category',
      select: 'label',
    },
  ]);

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
    // _id: data.jobId,
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

const getProviderReviews = async (userId: string) => {
  const provider = await Provider.findOne({
    user: userId,
  });

  if (!provider) {
    throw new Error('Provider not found');
  }

  const reviews = await Review.find({
    provider: provider._id,
  })
    .populate({
      path: 'user',
      select: 'name image location',
    })
    .populate({
      path: 'request',
      select: 'title category',
      populate: {
        path: 'category',
        select: 'label',
      },
    })
    .sort({ createdAt: -1 });

  return reviews;
};

export {
  overviewInfo,
  providerInfo,
  providerInfoUpdate,
  requestInfo,
  offerCreate,
  offeredInfo,
  providerJobsInfo,
  jobStatusChange,
  getProviderReviews,
};
