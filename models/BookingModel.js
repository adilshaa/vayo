const mongoose=require('mongoose')


const addressSchema = new mongoose.Schema({
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  });
  
const BookingData=mongoose.Schema({
    bookerName:{
        type:String,
        required:true
    },
    BookerId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user",
      required:true
    },
    bookerEmail:{
        type:String,
        required:true
    },
    bookerAddress:[addressSchema],
    
    bookerNumber:{
        type:String,
        required:true
    },
    // cheakingDat:{
    //     type:Date,
    //     required:true
    // },
    // cheakOutData:{
    //     type:Date,
    //     required:true
    // },
    ResortName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'resort',
        required:true
    },
    paymentMethod:{
      type:String,
      required:true
    },
    bookingAmount:{
      type:Number,
      required:true
    },
    CurrentBookingData:{
  type:Date,
    required:true
    },
    cheakoutDate:{
      type:Date,
    required:true
    },
    bookingId:{
      type:String,
      required:true
    },
    status:{
      type:String,
      required:true
    }
    // PurposeOfBooking:{
    //     type:String,
    //     required:true
    // }

})

module.exports=mongoose.model('booking',BookingData)