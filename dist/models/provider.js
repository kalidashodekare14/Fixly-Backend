"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const providerSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bio: {
        type: String,
    },
    experience: {
        type: Number,
    },
    skills: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Category',
        },
    ],
    location: {
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        division: {
            type: String,
        },
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    availableStatus: {
        type: Boolean,
        default: true,
    },
    rate: {
        type: Number,
    },
    rateType: {
        type: String,
        enum: ['hourly', 'fixed'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
providerSchema.index({ 'location.coordinates': '2dsphere' });
const Provider = mongoose_1.default.model('Provider', providerSchema);
exports.default = Provider;
