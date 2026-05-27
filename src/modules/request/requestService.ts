import Request from '../../models/request';
import { IRequest } from '../../types/request';
import Provider from '../../models/provider';
import { dispatchRequest } from '../../utils/dispatchRequest';
import Offer from '../../models/offer';
import request from '../../models/request';

const createRequest = async (userId: string, requestData: IRequest) => {
  // save data to database
  const request = await Request.create({ ...requestData, user: userId });

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
  const request = await Request.findOne({ user: userId }).populate(
    'user',
    'name email',
  );
  console.log('Retrieved request:', request);
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

const getOffersForRequest = async (requestId: string) => {
  console.log('Fetching offers for request ID:', requestId);
  const offers = await Offer.find({
    request: requestId,
    status: { $in: ['offered', 'accepted'] },
  }).populate({
    path: 'provider',
    populate: {
      path: 'user',
      select: 'name email phone',
    },
  });

  if (!offers) {
    throw new Error('Request not found');
  }
  console.log('Offers for request:', offers);
  return offers;
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
    { status: 'assigned' },
    { returnDocument: 'after' },
  );
};

export {
  createRequest,
  getRequest,
  requestUpdate,
  deleteRequest,
  getOffersForRequest,
  acceptOffer,
};
