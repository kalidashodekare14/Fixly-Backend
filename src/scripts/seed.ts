import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

import User from '../models/user';
import Provider from '../models/provider';

const MONGO_URI = 'mongodb://localhost:27017/fixly';

const services = [
  'Electrical Repair',
  'Plumbing',
  'AC Repair',
  'Painting',
  'Carpentry',
  'Cleaning',
  'Gardening',
  'CCTV Installation',
  'Computer Repair',
  'Mobile Repair',
];

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
    console.log('✅ DB Connected');

    await User.deleteMany({});
    await Provider.deleteMany({});
    console.log('🧹 Old data cleared');

    const hashedPassword = await bcrypt.hash('123456', 10);

    // =========================
    // STEP 1: CREATE IDS
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
    // STEP 2: USERS
    // =========================
    const providerUsers = providerUserIds.map((id, i) => ({
      _id: id,
      name: faker.person.fullName(),
      email: `provider${i + 1}@fixly.com`,
      password: hashedPassword,
      role: 'provider',
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
    console.log('👤 Users inserted');

    // =========================
    // STEP 3: PROVIDERS
    // =========================
    const providers = providerUserIds.map((id) => ({
      user: id,
      services: faker.helpers.arrayElements(services, 2),
      bio: faker.person.bio(),
      experience: faker.number.int({ min: 1, max: 15 }),
      skills: faker.helpers.arrayElements(
        ['Wiring', 'Repair', 'Installation', 'Maintenance', 'Troubleshooting'],
        3,
      ),

      location: {
        address: faker.location.streetAddress(),
        city: faker.helpers.arrayElement(cities),
        division: faker.helpers.arrayElement(cities),

        // IMPORTANT: keep schema compatible
        type: 'Point',

        coordinates: [faker.location.longitude(), faker.location.latitude()],
      },

      rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),

      reviews: ['Good service', 'Recommended'],

      availableStatus: faker.datatype.boolean(),

      rate: faker.number.int({ min: 500, max: 2500 }),

      rateType: faker.helpers.arrayElement(['hourly', 'fixed']),

      isVerified: faker.datatype.boolean(),
    }));

    console.log('📦 Provider count:', providers.length);

    const result = await Provider.insertMany(providers);

    console.log('✅ Providers inserted:', result.length);

    console.log('🎉 SEED COMPLETED SUCCESSFULLY');

    process.exit(0);
  } catch (error) {
    console.error('❌ SEED ERROR:', error);
    process.exit(1);
  }
}

seed();
