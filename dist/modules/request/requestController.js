"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyPaymentHistoryController = exports.paymentCancelController = exports.paymentFailController = exports.paymentSuccessController = exports.sslcommerzPaymentController = exports.viewSelectedOfferForRequestController = exports.viewOpenRequestController = exports.getSelectedProviderController = exports.acceptOfferController = exports.getOffersForRequestController = exports.deleteRequestController = exports.updateRequestController = exports.getRequestController = exports.createRequestController = exports.overviewInfoController = void 0;
const requestService_1 = require("./requestService");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const env_1 = require("../../config/env");
const payment_1 = __importDefault(require("../../models/payment"));
const overviewInfoController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const result = await (0, requestService_1.overviewInfo)(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Overivew info get successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.overviewInfoController = overviewInfoController;
const createRequestController = async (req, res) => {
    try {
        const userId = req.user?.id; // Assuming user ID is available in req.user
        let location = null;
        if (req.body.location) {
            location = JSON.parse(req.body.location);
        }
        const requestData = {
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            budget: req.body.budget,
            deadline: req.body.deadline,
            location,
            image: req.file?.path,
            providerId: req.body.providerId,
            requestType: req.body.requestType,
        };
        const { request, offers } = await (0, requestService_1.createRequest)(userId, requestData);
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: 'Request created successfully',
            data: { request, offers },
        });
    }
    catch (error) {
        console.error('Error creating request:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.createRequestController = createRequestController;
const getRequestController = async (req, res) => {
    try {
        const userId = req.user.id;
        const request = await (0, requestService_1.getRequest)(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Request retrieved successfully',
            data: request,
        });
    }
    catch (error) {
        console.error('Error retrieving request:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.getRequestController = getRequestController;
const viewSelectedOfferForRequestController = async (req, res) => {
    try {
        const userId = req.user.id;
        const request = await (0, requestService_1.viewSelectedOfferForRequest)(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Request with selected offer retrieved successfully',
            data: request,
        });
    }
    catch (error) {
        console.error('Error retrieving request with selected offer:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.viewSelectedOfferForRequestController = viewSelectedOfferForRequestController;
const updateRequestController = async (req, res) => {
    try {
        const userId = req.user.id;
        let location = null;
        if (req.body.location) {
            location = JSON.parse(req.body.location);
        }
        const updateData = {
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            budget: req.body.budget,
            deadline: req.body.deadline,
            location,
            image: req.file?.path,
        };
        const updatedRequest = await (0, requestService_1.requestUpdate)(userId, updateData);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Request updated successfully',
            data: updatedRequest,
        });
    }
    catch (error) {
        console.error('Error updating request:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.updateRequestController = updateRequestController;
const deleteRequestController = async (req, res) => {
    try {
        const userId = req.user.id;
        await (0, requestService_1.deleteRequest)(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Request deleted successfully',
            data: null,
        });
    }
    catch (error) {
        console.error('Error deleting request:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.deleteRequestController = deleteRequestController;
const viewOpenRequestController = async (req, res) => {
    try {
        const userId = req.user.id;
        const request = await (0, requestService_1.viewOpenRequest)(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Open requests retrieved successfully',
            data: request,
        });
    }
    catch (error) {
        console.error('Error retrieving open requests:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.viewOpenRequestController = viewOpenRequestController;
const getOffersForRequestController = async (req, res) => {
    try {
        const requestId = req.params.requestId.toString();
        const offers = await (0, requestService_1.getOffersForRequest)(requestId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Offers fetched successfully',
            data: offers,
        });
    }
    catch (error) {
        console.error('Error fetching offers:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.getOffersForRequestController = getOffersForRequestController;
const getSelectedProviderController = async (req, res) => {
    try {
        const requestId = req.params.requestId.toString();
        const offers = await (0, requestService_1.selectedProvider)(requestId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Accepted offers fetched successfully',
            data: offers,
        });
    }
    catch (error) {
        console.error('Error fetching accepted offers:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.getSelectedProviderController = getSelectedProviderController;
const acceptOfferController = async (req, res) => {
    try {
        const userId = req.user.id;
        const offerId = req.params.offerId.toString();
        await (0, requestService_1.acceptOffer)(userId, offerId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Offer accepted successfully',
            data: null,
        });
    }
    catch (error) {
        console.error('Error accepting offer:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.acceptOfferController = acceptOfferController;
const sslcommerzPaymentController = async (req, res) => {
    try {
        const userId = req.user.id.toString();
        const paymentInfo = req.body;
        const result = await (0, requestService_1.sslcommerzPayment)(userId, paymentInfo);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Offer accepted successfully',
            data: result,
        });
    }
    catch (error) {
        console.error('Error accepting offer:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.sslcommerzPaymentController = sslcommerzPaymentController;
const paymentSuccessController = async (req, res) => {
    try {
        const paymentId = req.body.value_a;
        await (0, requestService_1.paymentSuccessAndStatusChange)(paymentId);
        res.redirect(`${env_1.config.FRONTEND_URL}/payment-success`);
    }
    catch (error) {
        res.redirect(`${env_1.config.FRONTEND_URL}/payment-failed`);
    }
};
exports.paymentSuccessController = paymentSuccessController;
const paymentFailController = async (req, res) => {
    try {
        const paymentId = req.body.value_a;
        if (paymentId) {
            await payment_1.default.findByIdAndUpdate(paymentId, {
                status: 'failed',
            });
        }
        return res.redirect(`${env_1.config.FRONTEND_URL}/payment-failed`);
    }
    catch (error) {
        console.error('Payment fail error:', error);
        return res.redirect(`${env_1.config.FRONTEND_URL}/payment-failed`);
    }
};
exports.paymentFailController = paymentFailController;
const paymentCancelController = async (req, res) => {
    try {
        const paymentId = req.body.value_a;
        if (paymentId) {
            await payment_1.default.findByIdAndUpdate(paymentId, {
                status: 'cancelled',
            });
        }
        return res.redirect(`${env_1.config.FRONTEND_URL}/payment-cancelled`);
    }
    catch (error) {
        console.error('Payment cancel error:', error);
        return res.redirect(`${env_1.config.FRONTEND_URL}/payment-cancelled`);
    }
};
exports.paymentCancelController = paymentCancelController;
const getMyPaymentHistoryController = async (req, res) => {
    try {
        const payments = await (0, requestService_1.getMyPaymentHistory)(req.user.id, req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Payment history fetched successfully',
            data: payments,
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
exports.getMyPaymentHistoryController = getMyPaymentHistoryController;
