"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviderPaymentHistoryController = exports.getProviderReviewsController = exports.jobsStatusChangeController = exports.providerJobsInfoController = exports.sendOfferedInfoController = exports.offerCreateController = exports.requestInfoController = exports.providerInfoUpdateController = exports.providerInfoController = exports.overviewInfoController = void 0;
const providerService_1 = require("./providerService");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const overviewInfoController = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await (0, providerService_1.overviewInfo)(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            data: result,
            message: 'Overview information get successfully',
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            data: null,
            message: 'Failed to overview information',
        });
    }
};
exports.overviewInfoController = overviewInfoController;
const providerInfoController = async (req, res) => {
    try {
        const providerId = req.user.id;
        const providerData = await (0, providerService_1.providerInfo)(providerId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            data: providerData,
            message: 'Provider information successfully',
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            data: null,
            message: 'Failed to provider information',
        });
    }
};
exports.providerInfoController = providerInfoController;
const providerInfoUpdateController = async (req, res) => {
    try {
        const userId = req.user.id;
        const parsedLocation = JSON.parse(req.body.location);
        const location = {
            ...parsedLocation,
            coordinates: parsedLocation.coordinates.map(Number),
        };
        const updateData = {
            ...req.body,
            availableStatus: req.body.availableStatus === 'true',
            location,
        };
        if (req.file) {
            updateData.image = req.file.path;
        }
        const providerData = await (0, providerService_1.providerInfoUpdate)(userId, updateData);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            data: providerData,
            message: 'Provider information updated successfully',
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            data: null,
            message: 'Failed to update provider information',
        });
    }
};
exports.providerInfoUpdateController = providerInfoUpdateController;
const requestInfoController = async (req, res) => {
    try {
        const userId = req.user.id;
        const offerData = await (0, providerService_1.requestInfo)(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            data: offerData,
            message: 'Request information retrieved successfully',
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            data: null,
            message: 'Failed to retrieve request information',
        });
    }
};
exports.requestInfoController = requestInfoController;
const offerCreateController = async (req, res) => {
    try {
        const userId = req.user.id;
        const offerData = await (0, providerService_1.offerCreate)(userId, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            data: offerData,
            message: 'Offer created/updated successfully',
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            data: null,
            message: 'Failed to create/update offer',
        });
    }
};
exports.offerCreateController = offerCreateController;
const sendOfferedInfoController = async (req, res) => {
    try {
        const userId = req.user.id;
        const offeredData = await (0, providerService_1.offeredInfo)(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            data: offeredData,
            message: 'Request information retrieved successfully',
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            data: null,
            message: 'Failed to retrieve request information',
        });
    }
};
exports.sendOfferedInfoController = sendOfferedInfoController;
const providerJobsInfoController = async (req, res) => {
    try {
        const providerId = req.user.id;
        const providerData = await (0, providerService_1.providerJobsInfo)(providerId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            data: providerData,
            message: 'Provider Jobs information successfully',
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            data: null,
            message: 'Failed to provider jobs information',
        });
    }
};
exports.providerJobsInfoController = providerJobsInfoController;
const jobsStatusChangeController = async (req, res) => {
    try {
        const providerId = req.user.id;
        const jobData = req.body;
        const providerData = await (0, providerService_1.jobStatusChange)(providerId, jobData);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            data: providerData,
            message: 'Job status change successfully',
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            data: null,
            message: 'Job status change failed',
        });
    }
};
exports.jobsStatusChangeController = jobsStatusChangeController;
const getProviderReviewsController = async (req, res) => {
    try {
        const reviews = await (0, providerService_1.getProviderReviews)(req.user.id);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Provider reviews fetched successfully',
            data: reviews,
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
exports.getProviderReviewsController = getProviderReviewsController;
const getProviderPaymentHistoryController = async (req, res) => {
    try {
        const data = await (0, providerService_1.getProviderPaymentHistory)(req.user.id, req.query);
        res.status(200).json({
            success: true,
            message: 'Provider payment history fetched',
            data,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getProviderPaymentHistoryController = getProviderPaymentHistoryController;
