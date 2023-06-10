const mongoose = require('mongoose');

const faqSchema = mongoose.Schema({
    question:{
        type:String , default: ''
    },
    answer:{
        type: String , default: ''
    }

},{timestamps: true})

module.exports = mongoose.model('faq', faqSchema);