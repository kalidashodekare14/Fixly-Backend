"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsManage = exports.paymentsManage = exports.createCategories = exports.requestsManage = exports.userStatusChange = exports.adminOverviewInfo = exports.usersManage = void 0;
const category_1 = __importDefault(require("../../models/category"));
const provider_1 = __importDefault(require("../../models/provider"));
const user_1 = __importDefault(require("../../models/user"));
const request_1 = __importDefault(require("../../models/request"));
const payment_1 = __importDefault(require("../../models/payment"));
const review_1 = __importDefault(require("../../models/review"));
const mongoose_1 = __importDefault(require("mongoose"));
const adminOverviewInfo = async () => {
    const totalUsers = await user_1.default.countDocuments();
    const totalProviders = await provider_1.default.countDocuments();
    const totalRequests = await request_1.default.countDocuments();
    const totalRevenue = await request_1.default.aggregate([
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
    const result = await user_1.default.aggregate([
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
    const signupFormatted = {};
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
    const monthlyRevenue = await request_1.default.aggregate([
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
    const categoryStats = await request_1.default.aggregate([
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
    const recentUsers = await user_1.default.find().sort({ createdAt: 1 }).limit(5);
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
exports.adminOverviewInfo = adminOverviewInfo;
// Manage users
const usersManage = async (queryData) => {
    const { role, search, currentPage, dataLimit } = queryData;
    // user info
    const totalUsers = await user_1.default.countDocuments();
    const totalActiveUsers = await user_1.default.countDocuments({
        status: 'active',
    });
    const totalSuspendUsers = await user_1.default.countDocuments({
        status: 'suspend',
    });
    // Data filter
    const filter = {};
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
    const users = await user_1.default.find(filter).skip(skip).limit(limit);
    const total = await user_1.default.countDocuments(filter);
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
exports.usersManage = usersManage;
const userStatusChange = async (userId, data) => {
    const updateStatus = await user_1.default.findByIdAndUpdate(userId, {
        $set: {
            status: data.status,
        },
    }, {
        returnDocument: 'after',
    });
    return updateStatus;
};
exports.userStatusChange = userStatusChange;
// Manage requests
const requestsManage = async (queryData) => {
    const { status, search, currentPage, dataLimit } = queryData;
    // kpi info
    const totalRequests = await request_1.default.countDocuments();
    const totalPending = await request_1.default.countDocuments({
        status: 'pending',
    });
    const totalOpened = await request_1.default.countDocuments({
        status: 'open',
    });
    const totalInProgress = await request_1.default.countDocuments({
        status: 'in_progress',
    });
    const totalAssigned = await request_1.default.countDocuments({
        status: 'assigned',
    });
    const totalCompleted = await request_1.default.countDocuments({
        status: 'completed',
    });
    const totalCancelled = await request_1.default.countDocuments({
        status: 'cancelled',
    });
    // Data filter
    const filter = {};
    const matchedUsers = await user_1.default.find({
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
        if (mongoose_1.default.Types.ObjectId.isValid(search)) {
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
    const requests = await request_1.default.find(filter)
        .populate('user', 'name email image')
        .populate('category', 'label')
        .skip(skip)
        .limit(limit);
    const total = await request_1.default.countDocuments(filter);
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
exports.requestsManage = requestsManage;
const createCategories = async (categories) => {
    const category = await category_1.default.insertMany(categories);
    return category;
};
exports.createCategories = createCategories;
// Manage payments
const paymentsManage = async (queryData) => {
    const { status, search, currentPage, dataLimit } = queryData;
    // KPI info
    const totalPayments = await payment_1.default.countDocuments();
    const totalPaid = await payment_1.default.countDocuments({ status: 'paid' });
    const totalPending = await payment_1.default.countDocuments({ status: 'pending' });
    const totalFailed = await payment_1.default.countDocuments({ status: 'failed' });
    const totalCancelled = await payment_1.default.countDocuments({ status: 'cancelled' });
    const totalRefunded = await payment_1.default.countDocuments({ status: 'refunded' });
    // Data filter
    const filter = {};
    if (status && status !== 'all') {
        filter.status = status;
    }
    if (search) {
        const matchedRequests = await request_1.default.find({
            title: { $regex: search, $options: 'i' },
        }).select('_id');
        const matchedUsers = await user_1.default.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ],
        }).select('_id');
        const matchedProviders = await provider_1.default.find({
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
    const payments = await payment_1.default.find(filter)
        .populate({ path: 'user', select: 'name email image' })
        .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email image' },
    })
        .populate({ path: 'request', select: 'title budget' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await payment_1.default.countDocuments(filter);
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
exports.paymentsManage = paymentsManage;
// Manage reviews
const reviewsManage = async (queryData) => {
    const { rating, search, currentPage, dataLimit } = queryData;
    // KPI info
    const totalReviews = await review_1.default.countDocuments();
    const averageRating = await review_1.default.aggregate([
        { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    const rating5 = await review_1.default.countDocuments({ rating: 5 });
    const rating4 = await review_1.default.countDocuments({ rating: 4 });
    const rating3 = await review_1.default.countDocuments({ rating: 3 });
    const rating2 = await review_1.default.countDocuments({ rating: 2 });
    const rating1 = await review_1.default.countDocuments({ rating: 1 });
    // Data filter
    const filter = {};
    if (rating && rating !== 'all') {
        filter.rating = Number(rating);
    }
    if (search) {
        const matchedUsers = await user_1.default.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ],
        }).select('_id');
        const matchedProviders = await provider_1.default.find({
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
    const reviews = await review_1.default.find(filter)
        .populate({ path: 'user', select: 'name email image' })
        .populate({
        path: 'provider',
        populate: { path: 'user', select: 'name email image' },
    })
        .populate({ path: 'request', select: 'title' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await review_1.default.countDocuments(filter);
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
exports.reviewsManage = reviewsManage;
