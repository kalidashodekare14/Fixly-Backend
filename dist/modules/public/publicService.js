"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.providerPublicProfile = exports.publicService = void 0;
const provider_1 = __importDefault(require("../../models/provider"));
const category_1 = __importDefault(require("../../models/category"));
const user_1 = __importDefault(require("../../models/user"));
const publicService = async (data) => {
    const { search, category, priceMin, priceMax, currentPage, dataLimit, rating, } = data;
    const page = Number(currentPage) || 1;
    const limit = Number(dataLimit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};
    if (search) {
        const mathedCategories = await category_1.default.find({
            label: {
                $regex: search,
                $options: 'i',
            },
        }).select('_id');
        const matchedUsers = await user_1.default.find({
            name: {
                $regex: search,
                $options: 'i',
            },
        }).select('_id');
        filter.$or = [
            {
                skills: {
                    $in: mathedCategories.map((c) => c._id),
                },
            },
            {
                user: {
                    $in: matchedUsers.map((u) => u._id),
                },
            },
        ];
    }
    if (category) {
        const categories = category.split(',');
        filter.skills = { $in: categories };
    }
    if (priceMin || priceMax) {
        filter.rate = {};
        if (priceMin) {
            filter.rate.$gte = Number(priceMin);
        }
        if (priceMax) {
            filter.rate.$lte = Number(priceMax);
        }
    }
    if (rating) {
        filter.rating = { $gte: Number(rating) };
    }
    const providers = await provider_1.default.find(filter)
        .select('services location rating rate rateType experience availableStatus')
        .populate('user', 'name image')
        .populate('skills', 'label')
        .sort({ rating: -1 })
        .skip(skip)
        .limit(limit);
    const total = await provider_1.default.countDocuments(filter);
    return {
        data: providers,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.publicService = publicService;
const providerPublicProfile = async (providerId) => {
    const provider = await provider_1.default.findById(providerId)
        .select('bio rating location rating rate rateType experience availableStatus')
        .populate('user', 'name image email phone')
        .populate('skills', 'label');
    if (!provider) {
        throw new Error('Provider not found');
    }
    return provider;
};
exports.providerPublicProfile = providerPublicProfile;
const getCategories = async () => {
    const categories = await category_1.default.find();
    return categories;
};
exports.getCategories = getCategories;
