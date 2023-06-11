const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  shopName: {type: String , required: true},
  shopLocation: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2d',
    },
  },
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  riderName: {type: String },
  orderDate: {type: Date, default: Date.now},
  itemList: [
    {
      name:{ type: String, default: '', },
      unitPrice: {type: Number, default: 0, },
      quantity: {type: Number, default: 0, },
      totalPrice: {type: Number, default: 0, }
    }
  ],
  status:{type: String, enum:['accept','reject' ,'pending'] , default: 'pending'}
},{timestamps: true})

module.exports = mongoose.model('order', orderSchema);