"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const faker_1 = require("@faker-js/faker");
const user_1 = __importDefault(require("../models/user"));
const provider_1 = __importDefault(require("../models/provider"));
const category_1 = __importDefault(require("../models/category"));
const MONGO_URI = 'mongodb://localhost:27017/fixly';
const cities = [
    'Dhaka',
    'Chattogram',
    'Sylhet',
    'Khulna',
    'Rajshahi',
    'Barishal',
    'Rangpur',
    'Mymensingh',
];
async function seed() {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('✅ DB Connected');
        await user_1.default.deleteMany({});
        await provider_1.default.deleteMany({});
        console.log('🧹 Old data cleared');
        const hashedPassword = await bcryptjs_1.default.hash('123456', 10);
        // =========================
        // STEP 1: GET EXISTING CATEGORIES
        // =========================
        const categories = await category_1.default.find({});
        if (!categories.length) {
            throw new Error('❌ No categories found. Please seed categories first.');
        }
        console.log('📦 Categories loaded:', categories.length);
        // =========================
        // STEP 2: CREATE USER IDS
        // =========================
        const providerUserIds = Array.from({ length: 20 }, () => new mongoose_1.default.Types.ObjectId());
        const customerUserIds = Array.from({ length: 30 }, () => new mongoose_1.default.Types.ObjectId());
        // =========================
        // STEP 3: USERS
        // =========================
        const providerUsers = providerUserIds.map((id, i) => ({
            _id: id,
            name: faker_1.faker.person.fullName(),
            email: `provider${i + 1}@fixly.com`,
            password: hashedPassword,
            role: 'provider',
            image: faker_1.faker.image.avatar(),
            phone: faker_1.faker.phone.number(),
            location: {
                address: faker_1.faker.location.streetAddress(),
                city: faker_1.faker.helpers.arrayElement(cities),
                state: faker_1.faker.helpers.arrayElement(cities),
                zipCode: faker_1.faker.location.zipCode(),
            },
            bio: faker_1.faker.person.bio(),
            isVerified: faker_1.faker.datatype.boolean(),
        }));
        const customerUsers = customerUserIds.map((id, i) => ({
            _id: id,
            name: faker_1.faker.person.fullName(),
            email: `user${i + 1}@fixly.com`,
            password: hashedPassword,
            role: 'user',
            image: faker_1.faker.image.avatar(),
            phone: faker_1.faker.phone.number(),
            location: {
                address: faker_1.faker.location.streetAddress(),
                city: faker_1.faker.helpers.arrayElement(cities),
                state: faker_1.faker.helpers.arrayElement(cities),
                zipCode: faker_1.faker.location.zipCode(),
            },
            bio: faker_1.faker.person.bio(),
            isVerified: faker_1.faker.datatype.boolean(),
        }));
        await user_1.default.insertMany([...providerUsers, ...customerUsers]);
        console.log('👤 Users inserted');
        // =========================
        // STEP 4: PROVIDERS
        // =========================
        const providers = providerUserIds.map((id) => ({
            user: id,
            // ✅ using existing category IDs
            skills: faker_1.faker.helpers.arrayElements(categories.map((c) => c._id), 2),
            bio: faker_1.faker.person.bio(),
            experience: faker_1.faker.number.int({ min: 1, max: 15 }),
            location: {
                address: faker_1.faker.location.streetAddress(),
                city: faker_1.faker.helpers.arrayElement(cities),
                division: faker_1.faker.helpers.arrayElement(cities),
                type: 'Point',
                coordinates: [faker_1.faker.location.longitude(), faker_1.faker.location.latitude()],
            },
            rating: faker_1.faker.number.float({
                min: 3.5,
                max: 5,
                fractionDigits: 1,
            }),
            reviews: faker_1.faker.number.int({ min: 0, max: 200 }),
            availableStatus: faker_1.faker.datatype.boolean(),
            rate: faker_1.faker.number.int({ min: 500, max: 2500 }),
            rateType: faker_1.faker.helpers.arrayElement(['hourly', 'fixed']),
            isVerified: faker_1.faker.datatype.boolean(),
        }));
        console.log('📦 Provider count:', providers.length);
        const result = await provider_1.default.insertMany(providers);
        console.log('✅ Providers inserted:', result.length);
        console.log('🎉 SEED COMPLETED SUCCESSFULLY');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ SEED ERROR:', error);
        process.exit(1);
    }
}
seed();
