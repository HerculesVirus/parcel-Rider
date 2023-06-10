const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },

    userProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userProfile',
    },
    bussinessName: {
      type: String,
      required: [true, 'bussinessName is required.'],
    },

    photos: {
      type: Array,
      default: [],
    },

    place: {
      type: String,
      required: [true, 'place is required.'],
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      pinLocation: {
        type: String,
        default: '',
      },
      coordinates: {
        type: [Number],
        index: '2d',
      },
    },
    discription: {
      type: String,
      default: '',
    },
    isApprovedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('partner', partnerSchema);
