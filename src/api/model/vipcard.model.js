const mongoose = require('mongoose');

const vipcardSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'event' }, //the event for which the cars have been made
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    cards: [
      {
        vipcardName: { type: String },
        services: { type: Array },
        price: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('vipCard', vipcardSchema);
