import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema(
  {
    request: {
      type: Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
    },

    offer: {
      type: Schema.Types.ObjectId,
      ref: 'Offer',
      required: false,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    provider: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentMethod: {
      type: String,
      default: 'sslcommerz',
    },

    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
