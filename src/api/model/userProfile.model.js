const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: '',
    },

    fullName: {
      type: String,
      required: [true, 'name is required.'],
    },

    email: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
    },

    age: {
      type: String,
      default: '',
    },

    gender: {
      type: String,
      default: '',
      enum: ['male', 'female'],
    },

    membershipType: {
      type: String,
      default: '',
    },

    isPartnerCreated: { type: Boolean, default: false }, // boolean when user become  a partner


    phoneCode: {
      type: String,
      required: [true, 'PhoneCode is required'],
    },

    phoneNumber: {
      type: String,
      required: [true, 'phoneNumber is required'],
      default: '',
    },

    location: {
      type: String,
      default: '',
    },

    hobbies: {
      type: Array,
      default: [],
    },

    interests: {
      type: Array,
      default: [],
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    joinedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('userProfile', userProfileSchema);
