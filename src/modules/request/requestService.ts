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

export { createRequest };
