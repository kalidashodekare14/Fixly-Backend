"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = exports.loginUser = exports.registerUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const tokenService_1 = __importDefault(require("../../utils/tokenService"));
const user_1 = __importDefault(require("../../models/user"));
const provider_1 = __importDefault(require("../../models/provider"));
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
const verifyGoogleIdToken = async (idToken) => {
    const response = await axios_1.default.get('https://oauth2.googleapis.com/tokeninfo', {
        params: { id_token: idToken },
    });
    const payload = response.data;
    if (!payload.email_verified) {
        throw new Error('Google email not verified');
    }
    return {
        id: payload.sub,
        email: payload.email,
        verified_email: payload.email_verified,
        name: payload.name,
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture: payload.picture,
        locale: payload.locale,
    };
};
const findOrCreateGoogleUser = async (googleUser) => {
    let user = await user_1.default.findOne({
        $or: [{ googleId: googleUser.id }, { email: googleUser.email }],
    });
    if (user) {
        if (!user.googleId) {
            user.googleId = googleUser.id;
        }
        if (!user.image && googleUser.picture) {
            user.image = googleUser.picture;
        }
        await user.save();
    }
    else {
        const randomPassword = crypto_1.default.randomBytes(20).toString('hex');
        user = await user_1.default.create({
            name: googleUser.name,
            email: googleUser.email,
            password: randomPassword,
            image: googleUser.picture,
            googleId: googleUser.id,
            role: 'user',
        });
    }
    const token = (0, tokenService_1.default)({ id: user._id.toString() });
    const userObject = user.toObject();
    delete userObject.password;
    return { user: userObject, token };
};
const googleLogin = async (idToken) => {
    const googleUser = await verifyGoogleIdToken(idToken);
    return findOrCreateGoogleUser(googleUser);
};
exports.googleLogin = googleLogin;
