const mongoose=require('mongoose')
const Schema=mongoose.Schema

const otpSchema=new Schema({
    email:String,
    otp:String,
    expiresIn:Number,
    expireAt:{
        type:Date,
        default:Date.now,
        index:{expires:'5m'}
    }
},{
    timestamps:true
})

module.exports=mongoose.model('otpSchema',otpSchema)