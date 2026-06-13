"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchRequest = void 0;
const offer_1 = __importDefault(require("../models/offer"));
const dispatchRequest = async (requestId, providers) => {
    const offers = providers.map((provider) => {
        return {
            provider: provider._id,
            request: requestId,
            status: 'pending',
        };
    });
    await offer_1.default.insertMany(offers);
    return offers;
};
exports.dispatchRequest = dispatchRequest;
