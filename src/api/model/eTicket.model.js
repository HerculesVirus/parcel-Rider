const mongoose = require('mongoose');

const eTicketSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'event' },

    vipCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'vipCard' },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    place: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: '',
    },
    orderId: {
      type: String,
      default: '',
    },
    VipCardName: {
      type: String,
      default: '',
    },
    dateAndTime: {
      type: String,
      default: '',
    },
    genderType: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('eTicket', eTicketSchema);
