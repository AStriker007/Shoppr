const mongoose=require('mongoose')
const Schema=mongoose.Schema

const otpSchema=new Schema({
    email:String,
    otp:String,
    expiresIn:Number
},{
    timestamps:true
})

module.exports=mongoose.model('otpSchema',otpSchema)