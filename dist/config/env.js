"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/fixly',
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS || 10,
    JWT_SECRET: process.env.JWT_SECRET || 'df4d65e6r6dfd65re64e6r56f6e4re65f',
    SSL_COMMERZ_STORE_ID: process.env.SSL_COMMERZ_STORE_ID || '',
    SSL_COMMERZ_STORE_PASSWORD: process.env.SSL_COMMERZ_STORE_PASSWORD || '',
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
};
