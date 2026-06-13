"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoriesController = exports.reviewsManageController = exports.paymentsManageController = exports.requestsManageController = exports.userStatusChangeController = exports.usersManageController = exports.adminOverviewInfoController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const adminService_1 = require("./adminService");
const adminOverviewInfoController = async (req, res) => {
    try {
        const result = await (0, adminService_1.adminOverviewInfo)();
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Overview info get successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Failed to overview info',
        });
    }
};
exports.adminOverviewInfoController = adminOverviewInfoController;
const usersManageController = async (req, res) => {
    try {
        const result = await (0, adminService_1.usersManage)(req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Manage users successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Failed to manage users',
        });
    }
};
exports.usersManageController = usersManageController;
const userStatusChangeController = async (req, res) => {
    try {
        const userId = req.params.id.toString();
        const statusData = req.body;
        const result = await (0, adminService_1.userStatusChange)(userId, statusData);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Manage status change successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Failed to manage status change',
        });
    }
};
exports.userStatusChangeController = userStatusChangeController;
const requestsManageController = async (req, res) => {
    try {
        const result = await (0, adminService_1.requestsManage)(req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Manage requests successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Failed to manage requests',
        });
    }
};
exports.requestsManageController = requestsManageController;
const reviewsManageController = async (req, res) => {
    try {
        const result = await (0, adminService_1.reviewsManage)(req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Manage reviews successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Failed to manage reviews',
        });
    }
};
exports.reviewsManageController = reviewsManageController;
const paymentsManageController = async (req, res) => {
    try {
        const result = await (0, adminService_1.paymentsManage)(req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Manage payments successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Failed to manage payments',
        });
    }
};
exports.paymentsManageController = paymentsManageController;
const createCategoriesController = async (req, res) => {
    try {
        const result = await (0, adminService_1.createCategories)(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Categories created successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Failed to create categories',
        });
    }
};
exports.createCategoriesController = createCategoriesController;
