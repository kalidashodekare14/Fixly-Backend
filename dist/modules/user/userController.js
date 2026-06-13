"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInfoController = exports.userInfoController = exports.getMyProfileController = void 0;
const userService_1 = require("./userService");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const getMyProfileController = async (req, res) => {
    try {
        const result = await (0, userService_1.getNavbarProfile)(req.user.id);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: 'Profile retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 500,
            message: 'Failed to retrieve profile',
            data: null,
        });
    }
};
exports.getMyProfileController = getMyProfileController;
const userInfoController = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await (0, userService_1.userInfo)(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'User information retrieved successfully',
            data: user,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: error.message,
        });
    }
};
exports.userInfoController = userInfoController;
const updateUserInfoController = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path;
        }
        const user = await (0, userService_1.updateUserInfo)(userId, updateData);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'User information updated successfully',
            data: user,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: error.message,
        });
    }
};
exports.updateUserInfoController = updateUserInfoController;
