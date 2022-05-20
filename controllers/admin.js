const cloudinary=require('../config/cloudinary_config')
const Product=require('../models/products')

exports.addProduct=async(req, res, next)=>{
    const urls = []
    const size=req.files.length

    for(const file of req.files){
        const {path}=file
        try{
            const newUrl=await cloudinary.uploads(path,'Images')
            urls.push(newUrl)
        }catch(err){
            err.statusCode=500
            next(err)
        }
    }
   
           const product=new Product({
            name:req.body.name,
            category:req.body.category,
            description:req.body.description,
            stock:req.body.stock,
            price:req.body.price,
            images:urls
        })
        try{
            const newProduct=await product.save()           
            res.json({message:'Product Added Successfully'})  
        }catch(err){
            err.statusCode=500
            next(err)
        }       
        }