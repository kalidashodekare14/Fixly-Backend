import Category from '../../models/category';
import Provider from '../../models/provider';
import User from '../../models/user';
import Request from '../../models/request';
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

export {
  usersManage,
  adminOverviewInfo,
  userStatusChange,
  requestsManage,
  createCategories,
};
