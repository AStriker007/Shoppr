const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const productSchema=new Schema({
name:{
    type: String,
    required:[true,'Please enter a name']
},
category:{
    type:String,
    required:[true,'Please enter category']
},
description:{
    type:String,
    required:[true,'Please enter description']
},
stock:{
    type:Number,
    default:1
},
price:{
    type:Number,
    required:[true,'Please enter price']
},
images:{
    type:[
    {
        url:{
            type:String,
            required:true
        },
        id:{
            type:String,
            required:true
        }
    }
],
validate: [arrayLimit, 'exceeds the limit of 3']
}
},
{
    timestamps:true
}
)

// productSchema.path('images').validate(function (value) {
//     if (value.size > 3) {
//       throw new Error("size can't be greater than 3!");
//     }
//   });
function arrayLimit(val) {
    return val.length <= 3;
  }

module.exports=mongoose.model('Product',productSchema)