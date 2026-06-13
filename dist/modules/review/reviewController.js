"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewController = exports.getMyReviewsController = exports.createReviewController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const reviewService_1 = require("./reviewService");
const createReviewController = async (req, res) => {
    try {
        const review = await (0, reviewService_1.createReview)(req.user.id.toString(), req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Review submitted successfully',
            data: review,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            data: null,
        });
    }
};
exports.createReviewController = createReviewController;
const getMyReviewsController = async (req, res) => {
    try {
        const reviews = await (0, reviewService_1.getMyReviews)(req.user.id.toString());
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Reviews retrieved successfully',
            data: reviews,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: error.message,
        });
    }
};
exports.getMyReviewsController = getMyReviewsController;
const updateReviewController = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await (0, reviewService_1.updateReview)(req.user.id, reviewId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Review updated successfully',
            data: review,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: error.message,
        });
    }
};
exports.updateReviewController = updateReviewController;
