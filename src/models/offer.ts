import mongoose from 'mongoose';
import { IOffer } from '../types/offer';

const offerSchama = new mongoose.Schema<IOffer>(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    offeredPrice: {
      type: Number,
    },
    message: {
      type: String,
    },
    estimatedTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'offered', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const Offer = mongoose.model<IOffer>('Offer', offerSchama);

export default Offer;
