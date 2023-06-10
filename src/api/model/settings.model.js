const mongoose = require('mongoose');

const settingSchema = mongoose.Schema(
    {
        partyEssential:{
            music: {
                type:Array,
                default:[]
            },
            entertainment: {
                type: Array,
                default: [],
            },
            disclaimer: {
                type: Array,
                default: [],
            },
        },
        partyLux: {type: String, default: ''},
        privacyPolicy: {type: String, default: ''},
        termsAndCondition:{type: String, default: ''},
        contactInfo:{
            helpLine:{type:String ,default:''},
            email:{type:String ,default:''},
            address:{type:String , default:''},
            soicalLinks:{
                twitter:{type:String , default:''},
                facebook:{type:String , default: ''},
                google:{type:String , default:''}
            }
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('setting', settingSchema);

