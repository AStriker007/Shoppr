const Product=require('../models/products')

exports.getAllProducts=async(req,res,next)=>{
try{
    const products=await Product.find()
    res.json({products:products})
}   catch(err){
    next(err)
}
}