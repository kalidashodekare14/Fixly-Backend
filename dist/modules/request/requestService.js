"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyPaymentHistory = exports.paymentSuccessAndStatusChange = exports.sslcommerzPayment = exports.viewSelectedOfferForRequest = exports.acceptOffer = exports.selectedProvider = exports.getOffersForRequest = exports.viewOpenRequest = exports.deleteRequest = exports.requestUpdate = exports.getRequest = exports.createRequest = exports.overviewInfo = void 0;
const request_1 = __importDefault(require("../../models/request"));
const provider_1 = __importDefault(require("../../models/provider"));
const dispatchRequest_1 = require("../../utils/dispatchRequest");
const offer_1 = __importDefault(require("../../models/offer"));
const mongoose_1 = __importStar(require("mongoose"));
const env_1 = require("../../config/env");
const user_1 = __importDefault(require("../../models/user"));
const axios_1 = __importDefault(require("axios"));
const payment_1 = __importDefault(require("../../models/payment"));
const review_1 = __importDefault(require("../../models/review"));
const overviewInfo = async (userId) => {
    const totalRequests = await request_1.default.countDocuments({
        user: userId,
    });
    const pendingRequests = await request_1.default.countDocuments({
        user: userId,
        status: 'pending',
    });
    const assignedJobs = await request_1.default.countDocuments({
        user: userId,
        status: { $in: ['assigned', 'in_progress'] },
    });
    const completedJobs = await request_1.default.countDocuments({
        user: userId,
        status: 'completed',
    });
    const budgetSummary = await request_1.default.aggregate([
        {
            $match: {
                user: new mongoose_1.default.Types.ObjectId(userId),
            },
        },
        {
            $group: {
                _id: null,
                totalBudget: { $sum: '$budget' },
            },
        },
    ]);
    const mongthlyBudget = await request_1.default.aggregate([
        {
            $match: {
                user: new mongoose_1.default.Types.ObjectId(userId),
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
    const formated = mongthlyBudget.map((item) => ({
        month: months[item._id.month],
        amount: item.total,
    }));
    // category starts
    const categoryStats = await request_1.default.aggregate([
        {
            $match: {
                user: new mongoose_1.default.Types.ObjectId(userId),
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
    return {
        totalRequests,
        pendingRequests,
        assignedJobs,
        completedJobs,
        budgetSummary: budgetSummary[0],
        mongthlyBudget: formated,
        categoryStats,
    };
};
exports.overviewInfo = overviewInfo;
const createRequest = async (userId, requestData) => {
    // save data to database
    const request = await request_1.default.create({
        ...requestData,
        user: userId,
        ...(requestData.requestType === 'direct' && {
            provider: requestData.providerId,
        }),
        status: requestData.requestType === 'direct' ? 'assigned' : 'pending',
    });
    if (requestData.requestType === 'direct') {
        return { request, offer: [] };
    }
    // find nearby providers based on location
    const nearbyProviders = await provider_1.default.find({
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
    const offers = await (0, dispatchRequest_1.dispatchRequest)(request._id.toString(), nearbyProviders);
    return { request, offers };
};
exports.createRequest = createRequest;
const getRequest = async (userId) => {
    const request = await request_1.default.find({
        user: userId,
    }).populate('category', 'label');
    return request;
};
exports.getRequest = getRequest;
const requestUpdate = async (userId, updateData) => {
    const request = await request_1.default.findOne({ user: userId });
    if (!request) {
        throw new Error('Request not found');
    }
    if (request.status !== 'pending') {
        throw new Error('Request cannot be updated');
    }
    const { status, ...safeRequestData } = updateData;
    const updatedRequest = await request_1.default.findByIdAndUpdate(request._id, safeRequestData, { returnDocument: 'after' });
    return updatedRequest;
};
exports.requestUpdate = requestUpdate;
const deleteRequest = async (userId) => {
    const request = await request_1.default.findOne({ user: userId });
    if (!request) {
        throw new Error('Request not found');
    }
    if (request.status !== 'pending') {
        throw new Error('Request cannot be deleted');
    }
    const deletedRequest = await request_1.default.findByIdAndDelete(request._id);
    return deletedRequest;
};
exports.deleteRequest = deleteRequest;
const viewOpenRequest = async (userId) => {
    const request = await request_1.default.find({
        user: userId,
        status: 'open',
    }).populate('category', 'label');
    return request;
};
exports.viewOpenRequest = viewOpenRequest;
const viewSelectedOfferForRequest = async (userId) => {
    const requests = await request_1.default.find({
        user: userId,
        status: { $in: ['assigned', 'in_progress', 'completed'] },
    }).populate('category', 'label');
    const reviews = await review_1.default.find({
        user: userId,
    }).select('request');
    const reviewedRequestIds = reviews.map((review) => review.request.toString());
    const result = requests.map((request) => ({
        ...request.toObject(),
        isReviewed: reviewedRequestIds.includes(request._id.toString()),
    }));
    return result;
};
exports.viewSelectedOfferForRequest = viewSelectedOfferForRequest;
const getOffersForRequest = async (requestId) => {
    const offers = await offer_1.default.find({
        request: requestId,
        status: { $in: ['offered', 'accepted'] },
    }).populate({
        path: 'provider',
        populate: {
            path: 'user',
            select: 'name role image',
        },
    });
    if (!offers) {
        throw new Error('Request not found');
    }
    return offers;
};
exports.getOffersForRequest = getOffersForRequest;
const selectedProvider = async (requestId) => {
    const request = await request_1.default.findOne({
        _id: requestId,
        status: { $in: ['assigned', 'in_progress', 'completed'] },
    }).populate({
        path: 'provider',
        populate: {
            path: 'user',
            select: 'name role image',
        },
    });
    const offer = await offer_1.default.findOne({
        request: requestId,
        status: 'accepted',
    });
    return { request, offer: offer };
};
exports.selectedProvider = selectedProvider;
const acceptOffer = async (userId, offerId) => {
    const offer = await offer_1.default.findById(offerId);
    if (!offer) {
        throw new Error('Offer not found');
    }
    // check request and user match
    const request = await request_1.default.findById(offer.request);
    if (request?.user.toString() !== userId) {
        throw new Error('Unauthorized');
    }
    // update offer status
    await offer_1.default.findByIdAndUpdate(offerId, { status: 'accepted' });
    await offer_1.default.updateMany({
        request: offer.request,
        _id: { $ne: offerId },
        status: 'offered',
    }, { status: 'rejected' });
    // request status update
    await request_1.default.findByIdAndUpdate(offer.request, {
        status: 'assigned',
        provider: offer.provider,
    }, { returnDocument: 'after' });
};
exports.acceptOffer = acceptOffer;
// sslcommerz payment api
const sslcommerzPayment = async (userId, data) => {
    const { requestId, offerId } = data;
    const tnxId = new mongoose_1.Types.ObjectId().toString();
    // 1. Get request + user
    const request = await request_1.default.findById(requestId);
    const user = await user_1.default.findById(userId);
    if (!request || !user) {
        throw new Error('Invalid payment data');
    }
    let offer = null;
    let amount = 0;
    let providerId = request.provider;
    // 2. Decide flow
    if (request.requestType === 'direct') {
        amount = request.budget ?? 0;
    }
    else {
        if (!offerId) {
            throw new Error('OfferId required for normal request');
        }
        offer = await offer_1.default.findById(offerId);
        if (!offer) {
            throw new Error('Offer not found');
        }
        amount = offer.offeredPrice ?? 0;
        providerId = offer.provider;
    }
    // 3. Create payment
    const paymentInfo = await payment_1.default.create({
        request: requestId,
        offer: offer?._id || null,
        user: request.user,
        provider: providerId,
        amount: amount,
        transactionId: tnxId,
        status: 'pending',
    });
    // 4. SSLCommerz payload
    const initData = {
        store_id: env_1.config.SSL_COMMERZ_STORE_ID,
        store_passwd: env_1.config.SSL_COMMERZ_STORE_PASSWORD,
        total_amount: amount,
        currency: 'BDT',
        tran_id: tnxId,
        success_url: `${env_1.config.BACKEND_URL}/api/request/payment_success`,
        fail_url: `${env_1.config.BACKEND_URL}/api/request/payments_fail`,
        cancel_url: `${env_1.config.BACKEND_URL}/api/request/payments_cancel`,
        cus_name: user.name || 'N/A',
        cus_email: user.email || 'N/A',
        cus_phone: user.phone || '0000000000',
        product_name: 'Home Service Payment',
        product_category: 'service',
        product_profile: 'general',
        shipping_method: 'NO',
        value_a: paymentInfo._id.toString(),
        value_b: requestId,
        value_c: userId,
        value_d: tnxId,
    };
    // 5. Call SSLCommerz
    const response = await (0, axios_1.default)({
        method: 'POST',
        url: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
        data: new URLSearchParams(initData).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    if (!response.data?.GatewayPageURL) {
        throw new Error('Payment gateway failed');
    }
    return {
        paymentUrl: response.data.GatewayPageURL,
        transactionId: tnxId,
    };
};
exports.sslcommerzPayment = sslcommerzPayment;
const paymentSuccessAndStatusChange = async (paymentId) => {
    const payment = await payment_1.default.findById(paymentId);
    if (!payment) {
        throw new Error('Payment not found');
    }
    // prevent duplicate success call
    if (payment.status === 'paid') {
        return payment;
    }
    // payment paid
    payment.status = 'paid';
    await payment.save();
    const request = await request_1.default.findById(payment.request);
    if (!request) {
        throw new Error('Request not found');
    }
    // DIRECT HIRE FLOW
    if (request.requestType === 'direct') {
        await request_1.default.findByIdAndUpdate(request._id, {
            status: 'assigned',
        }, { new: true });
        return;
    }
    // NORMAL OFFER FLOW
    const offer = await offer_1.default.findById(payment.offer);
    if (!offer) {
        throw new Error('Offer not found');
    }
    // accepted offer
    await offer_1.default.findByIdAndUpdate(offer._id, {
        status: 'accepted',
    });
    // reject others
    await offer_1.default.updateMany({
        request: offer.request,
        _id: { $ne: offer._id },
        status: 'offered',
    }, {
        status: 'rejected',
    });
    // assign provider
    await request_1.default.findByIdAndUpdate(offer.request, {
        status: 'assigned',
        provider: offer.provider,
    }, { new: true });
    return;
};
exports.paymentSuccessAndStatusChange = paymentSuccessAndStatusChange;
// payment history
const getMyPaymentHistory = async (userId, queryData) => {
    const { search, status } = queryData;
    // kpi info
    const totalSpent = await payment_1.default.aggregate([
        {
            $match: {
                user: new mongoose_1.Types.ObjectId(userId),
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
        user: userId,
        status: 'paid',
    });
    const totalPending = await payment_1.default.countDocuments({
        user: userId,
        status: 'pending',
    });
    const totalFailed = await payment_1.default.countDocuments({
        user: userId,
        status: 'failed',
    });
    // filter data
    const filter = {
        user: userId,
    };
    if (status && status !== 'all') {
        filter.status = status;
    }
    if (search) {
        // 1. match requests (service title)
        const matchedRequests = await request_1.default.find({
            title: {
                $regex: search,
                $options: 'i',
            },
        }).select('_id');
        // 2. match providers by user name/email
        const matchedUsers = await user_1.default.find({
            $or: [
                {
                    name: { $regex: search, $options: 'i' },
                },
                {
                    email: { $regex: search, $options: 'i' },
                },
            ],
        }).select('_id');
        const matchedProviders = await provider_1.default.find({
            user: {
                $in: matchedUsers.map((u) => u._id),
            },
        }).select('_id');
        // OR filter
        filter.$or = [
            {
                provider: {
                    $in: matchedProviders.map((p) => p._id),
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
        path: 'provider',
        populate: {
            path: 'user',
            select: 'name image',
        },
    })
        .sort({ createdAt: -1 });
    return {
        paymentInfo: payments,
        kpiInfo: {
            totalSpent,
            totalPaid,
            totalPending,
            totalFailed,
        },
    };
};
exports.getMyPaymentHistory = getMyPaymentHistory;
