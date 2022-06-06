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
rating:{
    type:Number
},
reviews:[
    {
        userID:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        review:{
            type:Number,
            required:true
        }
    }
],
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

function arrayLimit(val) {
    return val.length <= 3;
  }

module.exports=mongoose.model('Product',productSchema)