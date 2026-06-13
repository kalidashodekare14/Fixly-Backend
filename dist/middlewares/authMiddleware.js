"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: 'Unauthorized',
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.JWT_SECRET);
        req.user = {
            id: decoded.id,
        };
        next();
    }
    catch (_error) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: 'Invalid token',
        });
    }
};
exports.authMiddleware = authMiddleware;
