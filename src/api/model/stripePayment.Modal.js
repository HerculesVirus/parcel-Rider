const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const stripePaymentSchema = mongoose.Schema(
  {
    eventSubscriber: {
      type: Schema.Types.ObjectId,
      ref: 'user',
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
    eventPrice: {
      type: Number,
      required: [true, 'eventPrice is required.'],
      default: 0,
    },

    fee_percentage: {
      type: Number,
      default: 20,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'event',
      // required: [true, 'training id is required.'],
    },

    eventName: {
      type: String,
      default: '',
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
  },
  {
    timestamps: true,
  }
);

const stripePayment = mongoose.model('stripePayment', stripePaymentSchema);

module.exports = stripePayment;
