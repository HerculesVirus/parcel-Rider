const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userProfile',
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'event',
    },

    subscriptionType: {
      type: String,
      default: '',
    },

    eventOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    eventName: {
      type: String,
    },

    userId: {
      type: String,
      default: '',
    },
    isCanceledByParticipant: {
      type: Boolean,
      default: false,
    },

    isAcceptedByOwner: {
      type: String,
      default: '',
      enum: ['', 'pending', 'accept', 'reject'],
    },
    genderType: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    VipCardName: {
      type: String,
      default: '',
    },
    membershipType: {
      type: String,
      default: '',
    },

    vipCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'vipCard' },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('subscription', subscriptionSchema);
