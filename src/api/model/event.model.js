const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required.'],
    },

    photos: {
      type: Array,
      default: [],
    },

    eventProfile: {
      type: String,
      default: '',
    },

    startDate: {
      type: String,
      default: '',
      required: [true, 'startDate is required.'],
    },
    endDate: {
      type: String,
      default: '',
    },
    place: {
      type: String,
      required: [true, 'place is required.'],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
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

    cancelationPolicy: {
      type: String,
      enum: ['24 hrs', '48 hrs', '72 hrs', 'any', 'none'],
      required: [true, 'cancelationPolicy is required.'],
    },

    admissionFee: {
      male: {
        free: {
          type: Boolean,
          default: false,
        },
        amount: {
          type: Number,
          default: 0,
        },
      },

      female: {
        free: {
          type: Boolean,
          default: false,
        },
        amount: {
          type: Number,
          default: 0,
        },
      },
      couple: {
        free: {
          type: Boolean,
          default: false,
        },
        amount: {
          type: Number,
          default: 0,
        },
      },
    },

    eventCategory: {
      type: String,
      default: '',
      enum: ['club', 'houseParty', 'bars'],
    },

    maxParticipants: {
      type: String,
      default: '',
      enum: ['0-25', '25-50', '50-100', 'unlimited'],
    },

    note: {
      type: String,
      default: '',
    },

    eventState: {
      type: String,
      default: 'open',
      enum: ['open', 'start', 'close'],
    },

    participants: [
      {
        participantId: {
          // user profile id
          type: String,
          default: '',
        },
        userId: {
          type: String,
          default: '',
        },
        gender: {
          type: String,
          default: '',
        },
        fullName: {
          type: String,
          default: '',
        },
        city: {
          type: String,
          default: '',
        },
        profileImage: {
          type: String,
          default: '',
        },

        membershipType: {
          type: String,
          default: '',
        },

        isAcceptedByOwner: {
          type: String,
          default: '',
        },
        isCanceledByParticipant: {
          type: Boolean,
          default: false,
        },
      },
    ],

    music: {
      type: Array,
      default: [],
    },

    entertainment: {
      type: Array,
      default: [],
    },

    disclaimer: {
      type: Array,
      default: [],
    },

    vipAccess: {
      type: Boolean,
      default: false,
    },

    ageLimit: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('event', eventSchema);
