import mongoose from 'mongoose';
import { IRequest } from '../types/request';

const requestSchema = new mongoose.Schema<IRequest>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      default: null,
    },
    image: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
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
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'open',
        'assigned',
        'in_progress',
        'completed',
        'cancelled',
      ],
      default: 'pending',
    },
    requestType: {
      type: String,
      enum: ['normal', 'direct'],
    },
  },
  { timestamps: true },
);

const Request = mongoose.model<IRequest>('Request', requestSchema);

export default Request;
