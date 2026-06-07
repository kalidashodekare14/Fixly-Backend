import Request from '../../models/request';
import { IRequest, IRequestClient } from '../../types/request';
import Provider from '../../models/provider';
import { dispatchRequest } from '../../utils/dispatchRequest';
import Offer from '../../models/offer';
import mongoose from 'mongoose';

const overviewInfo = async (userId: string) => {
  const totalRequests = await Request.countDocuments({
    user: userId,
  });

  const pendingRequests = await Request.countDocuments({
    user: userId,
    status: 'pending',
  });

  const assignedJobs = await Request.countDocuments({
    user: userId,
    status: { $in: ['assigned', 'in_progress'] },
  });

  const completedJobs = await Request.countDocuments({
    user: userId,
    status: 'completed',
  });

  const budgetSummary = await Request.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalBudget: { $sum: '$budget' },
      },
    },
  ]);

  const mongthlyBudget = await Request.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
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

  const formated = mongthlyBudget.map((item) => ({
    month: months[item._id.month],
    amount: item.total,
  }));

  // category starts
  const categoryStats = await Request.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
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

  return {
    totalRequests,
    pendingRequests,
    assignedJobs,
    completedJobs,
    budgetSummary: budgetSummary[0],
    mongthlyBudget: formated,
    categoryStats,
  };
};

const createRequest = async (userId: string, requestData: IRequestClient) => {
  // save data to database
  const request = await Request.create({
    ...requestData,
    user: userId,
    ...(requestData.requestType === 'direct' && {
      provider: requestData.providerId,
    }),
    status: requestData.requestType === 'direct' ? 'assigned' : 'pending',
  });

  if (requestData.requestType === 'direct') {
    return { request, offer: [] };
  }

  // find nearby providers based on location
  const nearbyProviders = await Provider.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: requestData.location.coordinates,
        },
        $maxDistance: 5000, // 5 km radius
      },
    },
  });

  // dispatch the request to nearby providers
  const offers = await dispatchRequest(request._id.toString(), nearbyProviders);

  return { request, offers };
};

const getRequest = async (userId: string) => {
  const request = await Request.find({
    user: userId,
  }).populate('category', 'label');
  return request;
};

const requestUpdate = async (userId: string, updateData: Partial<IRequest>) => {
  const request = await Request.findOne({ user: userId });
  if (!request) {
    throw new Error('Request not found');
  }
  if (request.status !== 'pending') {
    throw new Error('Request cannot be updated');
  }
  const { status, ...safeRequestData } = updateData;
  const updatedRequest = await Request.findByIdAndUpdate(
    request._id,
    safeRequestData,
    { returnDocument: 'after' },
  );

  return updatedRequest;
};

const deleteRequest = async (userId: string) => {
  const request = await Request.findOne({ user: userId });
  if (!request) {
    throw new Error('Request not found');
  }
  if (request.status !== 'pending') {
    throw new Error('Request cannot be deleted');
  }
  const deletedRequest = await Request.findByIdAndDelete(request._id);
  return deletedRequest;
};

const viewOpenRequest = async (userId: string) => {
  const request = await Request.find({
    user: userId,
    status: 'open',
  }).populate('category', 'label');
  return request;
};

const viewSelectedOfferForRequest = async (userId: string) => {
  const request = await Request.find({
    user: userId,
    status: { $in: ['assigned', 'in_progress', 'completed'] },
  }).populate('category', 'label');
  return request;
};

const getOffersForRequest = async (requestId: string) => {
  const offers = await Offer.find({
    request: requestId,
    status: { $in: ['offered', 'accepted'] },
  }).populate({
    path: 'provider',
    populate: {
      path: 'user',
      select: 'name role image',
    },
  });

  if (!offers) {
    throw new Error('Request not found');
  }
  return offers;
};

const selectedProvider = async (requestId: string) => {
  const request = await Request.findOne({
    _id: requestId,
    status: { $in: ['assigned', 'in_progress', 'completed'] },
  }).populate({
    path: 'provider',
    populate: {
      path: 'user',
      select: 'name role image',
    },
  });

  const offer = await Offer.findOne({
    request: requestId,
    status: 'accepted',
  });

  return { request, offer: offer };
};

const acceptOffer = async (userId: string, offerId: string) => {
  const offer = await Offer.findById(offerId);

  if (!offer) {
    throw new Error('Offer not found');
  }

  // check request and user match
  const request = await Request.findById(offer.request);

  if (request?.user.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  // update offer status
  await Offer.findByIdAndUpdate(offerId, { status: 'accepted' });
  await Offer.updateMany(
    {
      request: offer.request,
      _id: { $ne: offerId },
      status: 'offered',
    },
    { status: 'rejected' },
  );

  // request status update
  await Request.findByIdAndUpdate(
    offer.request,
    {
      status: 'assigned',
      provider: offer.provider,
    },
    { returnDocument: 'after' },
  );
};

export {
  overviewInfo,
  createRequest,
  getRequest,
  requestUpdate,
  deleteRequest,
  viewOpenRequest,
  getOffersForRequest,
  selectedProvider,
  acceptOffer,
  viewSelectedOfferForRequest,
};
