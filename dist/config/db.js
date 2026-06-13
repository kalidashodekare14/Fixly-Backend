"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    try {
        if (!env_1.config.MONGO_URL) {
            throw new Error('MongoDB Url not imported');
        }
        await mongoose_1.default.connect(env_1.config.MONGO_URL);
        console.log(`MongoDB Connected`);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
