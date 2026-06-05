import Provider from '../../models/provider';
import Category from '../../models/category';
import User from '../../models/user';

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
    const mathedCategories = await Category.find({
      label: {
        $regex: search,
        $options: 'i',
      },
    }).select('_id');

    const matchedUsers = await User.find({
      name: {
        $regex: search,
        $options: 'i',
      },
    }).select('_id');

    filter.$or = [
      {
        skills: {
          $in: mathedCategories.map((c) => c._id),
        },
      },
      {
        user: {
          $in: matchedUsers.map((u) => u._id),
        },
      },
    ];
  }

  if (category) {
    const categories = (category as string).split(',');
    filter.skills = { $in: categories };
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
    .populate('skills', 'label')
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

const getCategories = async () => {
  const categories = await Category.find();

  return categories;
};

export { publicService, providerPublicProfile, getCategories };
