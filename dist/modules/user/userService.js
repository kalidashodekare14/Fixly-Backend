"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInfo = exports.userInfo = exports.getNavbarProfile = void 0;
const user_1 = __importDefault(require("../../models/user"));
const getNavbarProfile = async (userId) => {
    const user = await user_1.default.findById(userId).select('image role name');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
exports.getNavbarProfile = getNavbarProfile;
const userInfo = async (userId) => {
    const user = await user_1.default.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
exports.userInfo = userInfo;
const updateUserInfo = async (userId, updateData) => {
    const updatePayload = Object.fromEntries(Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null));
    const user = await user_1.default.findByIdAndUpdate(userId, {
        $set: updatePayload,
    }, {
        returnDocument: 'after',
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
exports.updateUserInfo = updateUserInfo;
