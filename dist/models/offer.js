"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const offerSchama = new mongoose_1.default.Schema({
    request: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Request',
        required: true,
    },
    provider: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true,
    },
    offeredPrice: {
        type: Number,
    },
    message: {
        type: String,
    },
    estimatedTime: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'offered', 'accepted', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});
const Offer = mongoose_1.default.model('Offer', offerSchama);
exports.default = Offer;
