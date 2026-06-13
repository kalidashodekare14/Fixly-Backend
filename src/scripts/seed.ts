import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

import User from '../models/user';
import Provider from '../models/provider';
import Category from '../models/category';

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
    await mongoose.connect(MONGO_URI);
    // console.log('✅ DB Connected');

    await User.deleteMany({});
    await Provider.deleteMany({});
    // console.log('🧹 Old data cleared');

    const hashedPassword = await bcrypt.hash('123456', 10);

    // =========================
    // STEP 1: GET EXISTING CATEGORIES
    // =========================
    const categories = await Category.find({});

    if (!categories.length) {
      throw new Error('❌ No categories found. Please seed categories first.');
    }

    // console.log('📦 Categories loaded:', categories.length);

    // =========================
    // STEP 2: CREATE USER IDS
    // =========================
    const providerUserIds = Array.from(
      { length: 20 },
      () => new mongoose.Types.ObjectId(),
    );

    const customerUserIds = Array.from(
      { length: 30 },
      () => new mongoose.Types.ObjectId(),
    );

    // =========================
    // STEP 3: USERS
    // =========================
    const providerUsers = providerUserIds.map((id, i) => ({
      _id: id,
      name: faker.person.fullName(),
      email: `provider${i + 1}@fixly.com`,
      password: hashedPassword,
      role: 'provider',
      image: faker.image.avatar(),
      phone: faker.phone.number(),
      location: {
        address: faker.location.streetAddress(),
        city: faker.helpers.arrayElement(cities),
        state: faker.helpers.arrayElement(cities),
        zipCode: faker.location.zipCode(),
      },
      bio: faker.person.bio(),
      isVerified: faker.datatype.boolean(),
    }));

    const customerUsers = customerUserIds.map((id, i) => ({
      _id: id,
      name: faker.person.fullName(),
      email: `user${i + 1}@fixly.com`,
      password: hashedPassword,
      role: 'user',
      image: faker.image.avatar(),
      phone: faker.phone.number(),
      location: {
        address: faker.location.streetAddress(),
        city: faker.helpers.arrayElement(cities),
        state: faker.helpers.arrayElement(cities),
        zipCode: faker.location.zipCode(),
      },
      bio: faker.person.bio(),
      isVerified: faker.datatype.boolean(),
    }));

    await User.insertMany([...providerUsers, ...customerUsers]);
    // console.log('👤 Users inserted');

    // =========================
    // STEP 4: PROVIDERS
    // =========================
    const providers = providerUserIds.map((id) => ({
      user: id,

      // ✅ using existing category IDs
      skills: faker.helpers.arrayElements(
        categories.map((c) => c._id),
        2,
      ),

      bio: faker.person.bio(),
      experience: faker.number.int({ min: 1, max: 15 }),

      location: {
        address: faker.location.streetAddress(),
        city: faker.helpers.arrayElement(cities),
        division: faker.helpers.arrayElement(cities),
        type: 'Point',
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      },

      rating: faker.number.float({
        min: 3.5,
        max: 5,
        fractionDigits: 1,
      }),

      reviews: faker.number.int({ min: 0, max: 200 }),

      availableStatus: faker.datatype.boolean(),

      rate: faker.number.int({ min: 500, max: 2500 }),

      rateType: faker.helpers.arrayElement(['hourly', 'fixed']),

      isVerified: faker.datatype.boolean(),
    }));

    // console.log('📦 Provider count:', providers.length);

    const result = await Provider.insertMany(providers);

    // console.log('✅ Providers inserted:', result.length);

    // console.log('🎉 SEED COMPLETED SUCCESSFULLY');

    process.exit(0);
  } catch (error) {
    console.error('❌ SEED ERROR:', error);
    process.exit(1);
  }
}

seed();
