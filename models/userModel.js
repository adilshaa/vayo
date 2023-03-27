const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },      

    password: { 
        type: String,
        required: true
    },

    wishlist:[{
        ResortId:{
          type:  mongoose.Schema.Types.ObjectId,
            ref:'resort',
            requried:true
        }
        }],
    is_verified: {
        type: Boolean,
        default: 0,
    },
    user_status:{
        type:Boolean,
        default:true
    },
    otp:{
        type:Number,
        requried:true
    },
    complanteRegister:{
        type:Array,

    }
})

module.exports = mongoose.model('user', UserSchema)