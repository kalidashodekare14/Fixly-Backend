"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const requestSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    provider: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Provider',
        default: null,
    },
    image: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
    },
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
        postalCode: {
            type: String,
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    deadline: {
        type: Date,
    },
    status: {
        type: String,
        enum: [
            'pending',
            'open',
            'assigned',
            'in_progress',
            'completed',
            'cancelled',
        ],
        default: 'pending',
    },
    requestType: {
        type: String,
        enum: ['normal', 'direct'],
    },
}, { timestamps: true });
const Request = mongoose_1.default.model('Request', requestSchema);
exports.default = Request;
