const mongoose=require('mongoose')

const Add_resort=mongoose.Schema ({

    resortName:{
        type:String,
        requried:true
    },
    resortDiscription:{
        type:String,
        requried:true
    },
    resortLocation:{
        type:String,
        requried:true
    },
    resortsOtherImages:{
        type:Array,
        requried:true

    },
    resortPrice:{
        type:Number,
        requried:true

    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        requried:true

    },
    resortPolicies:{
        type:Array,
        requried:true

    },
    resortAmenities:{
        type:[String],
        requried:true
    },
    resortStatus:{
        type:Boolean,
        requried:true
    },
    resortRooms:{
        type:Number,
        requried:true
    },
    resortAvailabilityData:{
        type:Date,
        requried:true
    },
    review: [{
        title:{
            type:String,
        },
        body: {
          type: String,
        },
        userId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
       
      }],

})
module.exports=mongoose.model('resort',Add_resort)