"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLoginController = exports.loginController = exports.signUpController = void 0;
const authService_1 = require("./authService");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const signUpController = async (req, res) => {
    try {
        const result = await (0, authService_1.registerUser)(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Sign up successful',
            data: result,
        });
    }
    catch (error) {
        console.error('Sign up error:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.signUpController = signUpController;
const loginController = async (req, res) => {
    try {
        const result = await (0, authService_1.loginUser)(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Login successful',
            data: result,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.loginController = loginController;
const googleLoginController = async (req, res) => {
    try {
        const { idToken, credential } = req.body;
        const token = idToken || credential;
        if (!token) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 400,
                success: false,
                message: 'ID token is required',
                data: null,
            });
        }
        const result = await (0, authService_1.googleLogin)(token);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Google sign-in successful',
            data: result,
        });
    }
    catch (error) {
        console.error('Google login error:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: error.message || 'Google authentication failed',
            data: null,
        });
    }
};
exports.googleLoginController = googleLoginController;
