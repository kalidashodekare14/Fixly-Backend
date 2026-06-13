"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.loginUser = exports.registerUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const tokenService_1 = __importDefault(require("../../utils/tokenService"));
const user_1 = __importDefault(require("../../models/user"));
const provider_1 = __importDefault(require("../../models/provider"));
const googleLogin = async (userData) => {
    const { googleId, name, email, image } = userData;
    let user = await user_1.default.findOne({ $or: [{ googleId }, { email }] });
    if (user) {
        user.googleId = googleId;
        user.name = name;
        if (image)
            user.image = image;
        await user.save();
    }
    else {
        const placeholderPassword = crypto_1.default.randomBytes(20).toString('hex');
        user = await user_1.default.create({ googleId, name, email, image, password: placeholderPassword });
    }
    const token = (0, tokenService_1.default)({ id: user._id.toString() });
    const userObject = user.toObject();
    delete userObject.password;
    return { user: userObject, token };
};
exports.googleLogin = googleLogin;
const registerUser = async (userData) => {
    const { name, email, password, role } = userData;
    const existingUser = await user_1.default.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const newUser = await user_1.default.create({ name, email, password, role });
    if (role === 'provider') {
        await provider_1.default.create({ user: newUser._id });
    }
    return newUser;
};
exports.registerUser = registerUser;
const loginUser = async (userData) => {
    const { email, password } = userData;
    const user = await user_1.default.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    const token = (0, tokenService_1.default)({ id: user._id.toString() });
    const userObject = user.toObject();
    delete userObject.password;
    return { user: userObject, token };
};
exports.loginUser = loginUser;
