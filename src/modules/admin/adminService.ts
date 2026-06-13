import Category from '../../models/category';
import Provider from '../../models/provider';
import User from '../../models/user';
import Request from '../../models/request';
import Payment from '../../models/payment';
import Review from '../../models/review';
import mongoose from 'mongoose';

const adminOverviewInfo = async () => {
  const totalUsers = await User.countDocuments();
  const totalProviders = await Provider.countDocuments();
  const totalRequests = await Request.countDocuments();
  const totalRevenue = await Request.aggregate([
    {
      $match: {
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

  // Monthly Signups

  const result = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          role: '$role',
        },
        count: { $sum: 1 },
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

  const signupFormatted: Record<
    string,
    { month: string; users: number; providers: number }
  > = {};

  result.forEach((item) => {
    const monthName = months[item._id.month];

    if (!signupFormatted[monthName]) {
      signupFormatted[monthName] = {
        month: monthName,
        users: 0,
        providers: 0,
      };
    }

    if (item._id.role === 'user') {
      signupFormatted[monthName].users = item.count;
    }

    if (item._id.role === 'provider') {
      signupFormatted[monthName].providers = item.count;
    }
  });

  // Monthly Revenue

  const monthlyRevenue = await Request.aggregate([
    {
      $match: {
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

  const revenueFormated = monthlyRevenue.map((item) => ({
    month: months[item._id.month],
    amount: item.total,
  }));

  // Category Stats
  const categoryStats = await Request.aggregate([
    {
      $match: {
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

  const recentUsers = await User.find().sort({ createdAt: 1 }).limit(5);

  return {
    totalUsers,
    totalProviders,
    totalRequests,
    totalRevenue,
    monthlySignups: Object.values(signupFormatted),
    revenueData: revenueFormated,
    categoryStats,
    recentUsers,
  };
};

// Manage users
const usersManage = async (queryData: any) => {
  const { role, search, currentPage, dataLimit } = queryData;

  // user info
  const totalUsers = await User.countDocuments();
  const totalActiveUsers = await User.countDocuments({
    status: 'active',
  });
  const totalSuspendUsers = await User.countDocuments({
    status: 'suspend',
  });

  // Data filter
  const filter: any = {};

  if (role && role !== 'all') {
    filter.role = role;
  }

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        email: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }

  // pagination
  const page = Number(currentPage) || 1;
  const limit = Number(dataLimit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find(filter).skip(skip).limit(limit);

  const total = await User.countDocuments(filter);

  return {
    statsInfo: {
      totalUsers,
      totalActiveUsers,
      totalSuspendUsers,
    },
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const userStatusChange = async (userId: string, data: any) => {
  const updateStatus = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        status: data.status,
      },
    },
    {
      returnDocument: 'after',
    },
  );

  return updateStatus;
};

// Manage requests
const requestsManage = async (queryData: any) => {
  const { status, search, currentPage, dataLimit } = queryData;

  // kpi info
  const totalRequests = await Request.countDocuments();
  const totalPending = await Request.countDocuments({
    status: 'pending',
  });
  const totalOpened = await Request.countDocuments({
    status: 'open',
  });
  const totalInProgress = await Request.countDocuments({
    status: 'in_progress',
  });
  const totalAssigned = await Request.countDocuments({
    status: 'assigned',
  });
  const totalCompleted = await Request.countDocuments({
    status: 'completed',
  });
  const totalCancelled = await Request.countDocuments({
    status: 'cancelled',
  });

  // Data filter
  const filter: any = {};

  const matchedUsers = await User.find({
    $or: [
      {
        name: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        email: {
          $regex: search,
          $options: 'i',
        },
      },
    ],
  }).select('_id');

  if (search) {
    filter.$or = [
      {
        user: {
          $in: matchedUsers.map((u) => u._id),
        },
      },
    ];

    // Request ID search
    if (mongoose.Types.ObjectId.isValid(search)) {
      filter.$or.push({
        _id: search,
      });
    }
  }

  if (status && status !== 'all') {
    filter.status = status;
  }

  // pagination
  const page = Number(currentPage) || 1;
  const limit = Number(dataLimit) || 10;
  const skip = (page - 1) * limit;

  const requests = await Request.find(filter)
    .populate('user', 'name email image')
    .populate('category', 'label')
    .skip(skip)
    .limit(limit);

  const total = await Request.countDocuments(filter);

  return {
    kpiInfo: {
      totalRequests,
      totalPending,
      totalOpened,
      totalInProgress,
      totalAssigned,
      totalCompleted,
      totalCancelled,
    },
    data: requests,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const createCategories = async (categories: any) => {
  const category = await Category.insertMany(categories);
  return category;
};

// Manage payments
const paymentsManage = async (queryData: any) => {
  const { status, search, currentPage, dataLimit } = queryData;

  // KPI info
  const totalPayments = await Payment.countDocuments();
  const totalPaid = await Payment.countDocuments({ status: 'paid' });
  const totalPending = await Payment.countDocuments({ status: 'pending' });
  const totalFailed = await Payment.countDocuments({ status: 'failed' });
  const totalCancelled = await Payment.countDocuments({ status: 'cancelled' });
  const totalRefunded = await Payment.countDocuments({ status: 'refunded' });

  // Data filter
  const filter: any = {};

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search) {
    const matchedRequests = await Request.find({
      title: { $regex: search, $options: 'i' },
    }).select('_id');

    const matchedUsers = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');

    const matchedProviders = await Provider.find({
      user: { $in: matchedUsers.map((u) => u._id) },
    }).select('_id');

    filter.$or = [
      { user: { $in: matchedUsers.map((u) => u._id) } },
      { provider: { $in: matchedProviders.map((p) => p._id) } },
      { request: { $in: matchedRequests.map((r) => r._id) } },
      { transactionId: { $regex: search, $options: 'i' } },
    ];
  }

  // Pagination
  const page = Number(currentPage) || 1;
  const limit = Number(dataLimit) || 10;
  const skip = (page - 1) * limit;

  const payments = await Payment.find(filter)
    .populate({ path: 'user', select: 'name email image' })
    .populate({
      path: 'provider',
      populate: { path: 'user', select: 'name email image' },
    })
    .populate({ path: 'request', select: 'title budget' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Payment.countDocuments(filter);

  return {
    kpiInfo: {
      totalPayments,
      totalPaid,
      totalPending,
      totalFailed,
      totalCancelled,
      totalRefunded,
    },
    data: payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Manage reviews
const reviewsManage = async (queryData: any) => {
  const { rating, search, currentPage, dataLimit } = queryData;

  // KPI info
  const totalReviews = await Review.countDocuments();
  const averageRating = await Review.aggregate([
    { $group: { _id: null, avg: { $avg: '$rating' } } },
  ]);
  const rating5 = await Review.countDocuments({ rating: 5 });
  const rating4 = await Review.countDocuments({ rating: 4 });
  const rating3 = await Review.countDocuments({ rating: 3 });
  const rating2 = await Review.countDocuments({ rating: 2 });
  const rating1 = await Review.countDocuments({ rating: 1 });

  // Data filter
  const filter: any = {};

  if (rating && rating !== 'all') {
    filter.rating = Number(rating);
  }

  if (search) {
    const matchedUsers = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');

    const matchedProviders = await Provider.find({
      user: { $in: matchedUsers.map((u) => u._id) },
    }).select('_id');

    filter.$or = [
      { user: { $in: matchedUsers.map((u) => u._id) } },
      { provider: { $in: matchedProviders.map((p) => p._id) } },
      { comment: { $regex: search, $options: 'i' } },
    ];
  }

  // Pagination
  const page = Number(currentPage) || 1;
  const limit = Number(dataLimit) || 10;
  const skip = (page - 1) * limit;

  const reviews = await Review.find(filter)
    .populate({ path: 'user', select: 'name email image' })
    .populate({
      path: 'provider',
      populate: { path: 'user', select: 'name email image' },
    })
    .populate({ path: 'request', select: 'title' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(filter);

  return {
    kpiInfo: {
      totalReviews,
      averageRating: averageRating.length > 0 ? averageRating[0].avg : 0,
      rating5,
      rating4,
      rating3,
      rating2,
      rating1,
    },
    data: reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export {
  usersManage,
  adminOverviewInfo,
  userStatusChange,
  requestsManage,
  createCategories,
  paymentsManage,
  reviewsManage,
};
