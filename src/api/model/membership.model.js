const mongoose = require('mongoose');

const membershipSchema = mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userProfile',
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },


    membershipType: {
      type: String,
      default: '',
      enum: ['lux', 'party'],
    },

  
    amount: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('membership', membershipSchema);
