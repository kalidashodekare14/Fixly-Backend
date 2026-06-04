import Provider from '../../models/provider';

const publicService = async (data: any) => {
  const {
    search,
    category,
    priceMin,
    priceMax,
    currentPage,
    dataLimit,
    rating,
  } = data;

  const page = Number(currentPage) || 1;
  const limit = Number(dataLimit) || 10;
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (search) {
    filter.$or = [
      { services: { $regex: search, $options: 'i' } },
      { 'user.name': { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    const categories = (category as string).split(',');
    filter.services = { $in: categories };
  }

  if (priceMin || priceMax) {
    filter.rate = {};
    if (priceMin) {
      filter.rate.$gte = Number(priceMin);
    }
    if (priceMax) {
      filter.rate.$lte = Number(priceMax);
    }
  }

  if (rating) {
    filter.rating = { $gte: Number(rating) };
  }

  const providers = await Provider.find(filter)
    .select('services location rating rate rateType experience availableStatus')
    .populate('user', 'name image')
    .sort({ rating: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Provider.countDocuments(filter);

  return {
    data: providers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const providerPublicProfile = async (providerId: string) => {
  const provider = await Provider.findById(providerId)
    .select(
      'bio services rating location rating rate rateType experience availableStatus',
    )
    .populate('user', 'name image email phone');
  if (!provider) {
    throw new Error('Provider not found');
  }
  return provider;
};

export { publicService, providerPublicProfile };
