import mongoose from 'mongoose';
import { IRequest } from '../types/request';

const requestSchema = new mongoose.Schema<IRequest>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
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
    dateline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const Request = mongoose.model<IRequest>('Request', requestSchema);

export default Request;
