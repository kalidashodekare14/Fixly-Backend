"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesController = exports.providerPublicProfileController = exports.publicServiceController = void 0;
const publicService_1 = require("./publicService");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const publicServiceController = async (req, res) => {
    try {
        const providers = await (0, publicService_1.publicService)(req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            data: providers,
            message: 'Providers fetched successfully',
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Error fetching providers',
            data: null,
        });
    }
};
exports.publicServiceController = publicServiceController;
const providerPublicProfileController = async (req, res) => {
    try {
        const providerId = req.params.id.toString();
        const provider = await (0, publicService_1.providerPublicProfile)(providerId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            data: provider,
            message: 'Provider profile fetched successfully',
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Error fetching provider profile',
            data: null,
        });
    }
};
exports.providerPublicProfileController = providerPublicProfileController;
const getCategoriesController = async (req, res) => {
    try {
        const categories = await (0, publicService_1.getCategories)();
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            data: categories,
            message: 'categories data fetched successfully',
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: `Error fetching categories data: ${error?.messsage}`,
            data: null,
        });
    }
};
exports.getCategoriesController = getCategoriesController;
