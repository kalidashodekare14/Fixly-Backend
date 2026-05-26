import mongoose from 'mongoose';
import { IProvider } from '../types/provider';

const providerSchema = new mongoose.Schema<IProvider>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    services: {
      type: [String],
    },
    experience: {
      type: Number,
    },
    skills: {
      type: [String],
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
      type: [String],
      default: [],
    },
    availableStatus: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available',
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
  },
  { timestamps: true },
);

providerSchema.index({ 'location.coordinates': '2dsphere' });

const Provider = mongoose.model<IProvider>('Provider', providerSchema);

export default Provider;
