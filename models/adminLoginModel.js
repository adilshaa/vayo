const mongoose=require('mongoose')
const adminData=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
let Admins=mongoose.model('admin',adminData)
module.exports= Admins