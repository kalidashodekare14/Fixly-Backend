"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReview = exports.getMyReviews = exports.createReview = void 0;
const review_1 = __importDefault(require("../../models/review"));
const request_1 = __importDefault(require("../../models/request"));
const createReview = async (userId, payload) => {
    const { requestId, rating, comment } = payload;
    console.log('checking review data', payload);
    const request = await request_1.default.findById(requestId);
    if (!request) {
        throw new Error('Request not found');
    }
    // request owner check
    if (request.user.toString() !== userId) {
        throw new Error('Unauthorized');
    }
    // completed job check
    if (request.status !== 'completed') {
        throw new Error('You can only review completed jobs');
    }
    // duplicate review prevent
    const existingReview = await review_1.default.findOne({
        request: requestId,
    });
    if (existingReview) {
        throw new Error('Review already submitted');
    }
    const review = await review_1.default.create({
        user: userId,
        provider: request.provider,
        request: requestId,
        rating,
        comment,
    });
    return review;
};
exports.createReview = createReview;
const getMyReviews = async (userId) => {
    const reviews = await review_1.default.find({
        user: userId,
    })
        .populate({
        path: 'request',
        populate: {
            path: 'category',
            select: 'label',
        },
        // select: 'title status budget',
    })
        .populate({
        path: 'provider',
        populate: {
            path: 'user',
            select: 'name image',
        },
    })
        .sort({ createdAt: -1 });
    return reviews;
};
exports.getMyReviews = getMyReviews;
const updateReview = async (userId, reviewId, payload) => {
    const review = await review_1.default.findById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }
    // ownership check
    if (review.user.toString() !== userId) {
        throw new Error('Unauthorized');
    }
    // update allowed fields only
    if (payload.rating !== undefined) {
        review.rating = payload.rating;
    }
    if (payload.comment !== undefined) {
        review.comment = payload.comment;
    }
    await review.save();
    return review;
};
exports.updateReview = updateReview;
