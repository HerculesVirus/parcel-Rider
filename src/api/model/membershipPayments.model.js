const mongoose = require('mongoose');

const membershipPaymentsSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User id is required.'],
    },
    customerId: {
      type: String,
      required: [true, 'Customer id is required.'],
    },
    paymentIntent: {
      type: String,
      required: [true, 'payment intent id is required.'],
    },
    membershipFee: {
      type: Number,
      required: [true, 'membershipFee is required.'],
      default: 0,
    },

    membershipType: {
      type: String,
      default: '',
      enum: ['lux', 'party'],
    },
    currency: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      default: '',
    },
    paymentMethodTypes: {
      type: Array,
      default: null,
    },
    paymentUrl: {
      type: String,
      default: '',
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('membershipPayments', membershipPaymentsSchema);
