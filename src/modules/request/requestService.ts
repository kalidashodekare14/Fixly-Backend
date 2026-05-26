import Request from '../../models/request';
import { IRequest } from '../../types/request';
import Provider from '../../models/provider';
import { dispatchRequest } from '../../utils/dispatchRequest';

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

const getRequest = async (requestId: string) => {
  const request = await Request.findOne({ user: requestId }).populate(
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

export { createRequest, getRequest, requestUpdate };
