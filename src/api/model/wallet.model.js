const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, //the user
    balance: { type: Number, default: 0 },
    transacrion: [
      {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'event' }, //transaction is made on this event
        refund: { type: String, default: '' }, //refund the transaction
        transType: {
          type: String,
          default: '',
          enum: ['debit', 'credit', ''],
        }, // transaction type
        action: {
          type: String,
          default: '',
        },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, //either ownerId or participantId
        participateId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        amount: { type: Number, default: 0 }, // transaction amount
        date: { type: Date, default: Date.now }, // transaction date
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('wallet', walletSchema);
