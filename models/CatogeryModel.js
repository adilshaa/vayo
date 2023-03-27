const mongoose= require('mongoose')

const categoryData =mongoose.Schema({
    category:{
        type:String,
        requried:true
    },
    categorydiscription:{
        type:String,
        requried:true
    },
    categoryStatus:{
        type:Boolean,
        default:true
    },
    categoryImages:{
        type:Array,
        requried:true
    }


})
module.exports=mongoose.model('category',categoryData)


