const mongoose = require('mongoose');

const supportSchema = mongoose.Schema({
    firstName: {type: String , default:''},
    email:{type: String , default:''},
    message:{type: String , default: ''},
    isActive:{type: Boolean , default: false}
},{timestamps: true})

module.exports = mongoose.model('support', supportSchema);