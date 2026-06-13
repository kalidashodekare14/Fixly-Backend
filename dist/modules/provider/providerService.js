"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviderPaymentHistory = exports.getProviderReviews = exports.jobStatusChange = exports.providerJobsInfo = exports.offeredInfo = exports.offerCreate = exports.requestInfo = exports.providerInfoUpdate = exports.providerInfo = exports.overviewInfo = void 0;
const provider_1 = __importDefault(require("../../models/provider"));
const user_1 = __importDefault(require("../../models/user"));
const offer_1 = __importDefault(require("../../models/offer"));
const request_1 = __importDefault(require("../../models/request"));
const provider_2 = __importDefault(require("../../models/provider"));
const review_1 = __importDefault(require("../../models/review"));
const payment_1 = __importDefault(require("../../models/payment"));
const user_2 = __importDefault(require("../../models/user"));
const mongoose_1 = require("mongoose");
const overviewInfo = async (userId) => {
    const provider = await provider_2.default.findOne({
        user: userId,
    });
    if (!provider) {
        throw new Error('Provider not found');
    }
    const pendingRequests = await offer_1.default.countDocuments({
        provider: provider._id,
        status: 'pending',
    });
    const activeJobs = await request_1.default.countDocuments({
        provider: provider._id,
        status: { $in: ['assigned', 'in_progress'] },
    });
    const completedJobs = await request_1.default.countDocuments({
        provider: provider._id,
        status: 'completed',
    });
    const completedEarnings = await request_1.default.aggregate([
        {
            $match: {
                provider: provider._id,
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
    const monthlyEarnings = await request_1.default.aggregate([
        {
            $match: {
                provider: provider._id,
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
    const formated = monthlyEarnings.map((item) => ({
        month: months[item._id.month],
        amount: item.total,
    }));
    // category starts
    const categoryStats = await request_1.default.aggregate([
        {
            $match: {
                provider: provider._id,
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
    // recent requests
    const recentRequests = await request_1.default.find({
        provider: provider._id,
    })
        .sort({ createdAt: 1 })
        .limit(5)
        .populate('category', 'label')
        .populate('user', 'name');
    return {
        pendingRequests,
        activeJobs,
        completedJobs,
        completedEarnings: completedEarnings[0],
        monthlyEarnings: formated,
        categoryStats,
        recentRequests,
    };
};
exports.overviewInfo = overviewInfo;
const providerInfo = async (providerId) => {
    const providerData = await provider_1.default
        .findOne({
        user: providerId,
    })
        .populate('user', 'name email phone image role')
        .populate('skills', 'label');
    return providerData;
};
exports.providerInfo = providerInfo;
const providerInfoUpdate = async (userId, data) => {
    const userData = {};
    const providerData = {};
    // ----------------------USER-----------------------
    if (data.name)
        userData.name = data.name;
    if (data.email)
        userData.email = data.email;
    if (data.phone)
        userData.phone = data.phone;
    if (data.image)
        userData.image = data.image;
    // ----------------------PROVIDER-----------------------
    if (data.skills) {
        try {
            providerData.skills =
                typeof data.skills === 'string' ? JSON.parse(data.skills) : data.skills;
        }
        catch {
            providerData.skills = [];
        }
    }
    if (data.location)
        providerData.location = data.location;
    if (data.bio)
        providerData.bio = data.bio;
    if (typeof data.availableStatus === 'boolean') {
        providerData.availableStatus = data.availableStatus;
    }
    if (data.location) {
        providerData.location = data.location;
    }
    if (data.rate !== undefined) {
        const rate = Number(data.rate);
        if (!isNaN(rate))
            providerData.rate = rate;
    }
    if (data.rateType)
        providerData.rateType = data.rateType;
    // ---------------- UPDATE USER ----------------
    if (Object.keys(userData).length > 0) {
        await user_1.default.findByIdAndUpdate(userId, userData, { new: true });
    }
    // ---------------- UPDATE PROVIDER ----------------
    let updatedProvider = null;
    if (Object.keys(providerData).length > 0) {
        updatedProvider = await provider_1.default.findOneAndUpdate({ user: userId }, providerData, { new: true });
    }
    return updatedProvider;
};
exports.providerInfoUpdate = providerInfoUpdate;
const requestInfo = async (userId) => {
    const providerData = await provider_1.default.findOne({ user: userId });
    if (!providerData) {
        throw new Error('Provider not found');
    }
    const offers = await offer_1.default.find({
        provider: providerData._id,
        status: 'pending',
    }).populate({
        path: 'request',
        populate: [
            {
                path: 'user',
                select: 'name image',
            },
            {
                path: 'category',
                select: 'label',
            },
        ],
    });
    // clean response (hide internal status if needed)
    const cleanedOffers = offers.map((offer) => {
        const { __v, ...rest } = offer.toObject();
        return rest;
    });
    return cleanedOffers;
};
exports.requestInfo = requestInfo;
const offerCreate = async (userId, data) => {
    const providerData = await provider_1.default.findOne({ user: userId });
    if (!providerData) {
        throw new Error('Provider not found');
    }
    const existingOffer = await offer_1.default.findOne({
        provider: providerData._id,
        request: data.requestId,
    });
    if (existingOffer?.status === 'accepted') {
        throw new Error('Offer already accepted, cannot update');
    }
    const offer = await offer_1.default.findOneAndUpdate({
        provider: providerData._id,
        request: data.requestId,
    }, {
        $set: {
            ...(data.offeredPrice !== undefined && {
                offeredPrice: data.offeredPrice,
            }),
            ...(data.message && { message: data.message }),
            ...(data.estimatedTime && {
                estimatedTime: data.estimatedTime,
            }),
            status: 'offered',
        },
        $setOnInsert: {
            provider: providerData._id,
            request: data.requestId,
        },
    }, {
        upsert: true,
        new: true,
    });
    await request_1.default.findByIdAndUpdate(data.requestId, { status: 'open' });
    return offer;
};
exports.offerCreate = offerCreate;
const offeredInfo = async (userId) => {
    const providerData = await provider_1.default.findOne({ user: userId });
    if (!providerData) {
        throw new Error('Provider not found');
    }
    const offers = await offer_1.default.find({
        provider: providerData._id,
        status: 'offered',
    }).populate({
        path: 'request',
        populate: [
            {
                path: 'user',
                select: 'name image',
            },
            {
                path: 'category',
                select: 'label',
            },
        ],
    });
    // clean response (hide internal status if needed)
    const cleanedOffers = offers.map((offer) => {
        const { __v, ...rest } = offer.toObject();
        return rest;
    });
    return cleanedOffers;
};
exports.offeredInfo = offeredInfo;
const providerJobsInfo = async (userId) => {
    const providerData = await provider_1.default.findOne({ user: userId });
    if (!providerData) {
        throw new Error('Provider not found');
    }
    const jobsData = await request_1.default.find({
        provider: providerData._id,
        status: { $in: ['assigned', 'in_progress', 'completed'] },
    }).populate([
        {
            path: 'user',
            select: 'name image',
        },
        {
            path: 'category',
            select: 'label',
        },
    ]);
    // clean response (hide internal status if needed)
    const cleanedJobs = jobsData.map((offer) => {
        const { __v, ...rest } = offer.toObject();
        return rest;
    });
    return cleanedJobs;
};
exports.providerJobsInfo = providerJobsInfo;
const jobStatusChange = async (userId, data) => {
    const providerData = await provider_1.default.findOne({ user: userId });
    if (!providerData) {
        throw new Error('Provider not found');
    }
    const jobsData = await offer_1.default.findOne({
        // _id: data.jobId,
        provider: providerData._id,
        status: 'accepted',
    }).populate('request');
    if (!jobsData) {
        throw new Error('Job not found');
    }
    await request_1.default.findByIdAndUpdate(jobsData.request._id, {
        status: data.status,
    }, {
        returnDocument: 'after',
        runValidators: true,
    });
};
exports.jobStatusChange = jobStatusChange;
const getProviderReviews = async (userId) => {
    const provider = await provider_2.default.findOne({
        user: userId,
    });
    if (!provider) {
        throw new Error('Provider not found');
    }
    const reviews = await review_1.default.find({
        provider: provider._id,
    })
        .populate({
        path: 'user',
        select: 'name image location',
    })
        .populate({
        path: 'request',
        select: 'title category',
        populate: {
            path: 'category',
            select: 'label',
        },
    })
        .sort({ createdAt: -1 });
    return reviews;
};
exports.getProviderReviews = getProviderReviews;
const getProviderPaymentHistory = async (userId, queryData) => {
    const { search = '', status } = queryData;
    const provider = await provider_2.default.findOne({
        user: userId,
    });
    if (!provider) {
        throw new Error('Provider not found');
    }
    // stats info
    const totalEarnings = await payment_1.default.aggregate([
        {
            $match: {
                provider: new mongoose_1.Types.ObjectId(provider._id),
                status: 'paid',
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' },
            },
        },
    ]);
    const totalPaid = await payment_1.default.countDocuments({
        provider: provider._id,
        status: 'paid',
    });
    const totalPending = await payment_1.default.countDocuments({
        provider: provider._id,
        status: 'pending',
    });
    const totalFailed = await payment_1.default.countDocuments({
        provider: provider._id,
        status: 'failed',
    });
    const totalCancelled = await payment_1.default.countDocuments({
        provider: provider._id,
        status: 'cancelled',
    });
    // filter
    const filter = {
        provider: provider._id,
    };
    if (status && status !== 'all') {
        filter.status = status;
    }
    if (search) {
        const matchedRequests = await request_1.default.find({
            title: {
                $regex: search,
                $options: 'i',
            },
        }).select('_id');
        const matchedUsers = await user_2.default.find({
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
        filter.$or = [
            {
                user: {
                    $in: matchedUsers.map((u) => u._id),
                },
            },
            {
                request: {
                    $in: matchedRequests.map((r) => r._id),
                },
            },
            {
                transactionId: {
                    $regex: search,
                    $options: 'i',
                },
            },
        ];
    }
    const payments = await payment_1.default.find(filter)
        .populate({
        path: 'request',
        select: 'title image',
    })
        .populate({
        path: 'user',
        select: 'name image',
    })
        .sort({ createdAt: -1 });
    return {
        payments: payments,
        statsInfo: {
            totalEarnings,
            totalPaid,
            totalPending,
            totalFailed,
            totalCancelled,
        },
    };
};
exports.getProviderPaymentHistory = getProviderPaymentHistory;
