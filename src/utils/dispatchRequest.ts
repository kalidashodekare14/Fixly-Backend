import Offer from '../models/offer';

const dispatchRequest = async (requestId: string, providers: any[]) => {
  const offers = providers.map((provider) => {
    return {
      provider: provider._id,
      request: requestId,
      status: 'pending',
    };
  });

  await Offer.insertMany(offers);
  return offers;
};

export { dispatchRequest };
