"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    provider: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true,
    },
    request: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Request',
        required: true,
        unique: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
const Review = mongoose_1.default.model('Review', reviewSchema);
exports.default = Review;
