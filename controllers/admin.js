const cloudinary=require('../config/cloudinary_config')
const Order = require('../models/order')
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

        exports.updateProduct=(req,res,next)=>{
            const product_id=req.params.id
        Product.findById(product_id).then(product=>{
            if(!product){
                const error = new Error('Invalid id')
                error.statusCode=422;
                throw error;
            }
            return Product.findByIdAndUpdate(product_id,req.body,{
                new:true
            })  
        }).then(updatedProduct=>{
            res.json({message:'Product Updated Successfully'})
        }).catch(err=>{
            err.statusCode=500
            next(err)
        })
              
        }

        exports.deleteProduct=(req,res,next)=>{
            const product_id=req.params.id
            Product.findById(product_id).then(product=>{
                if(!product){
                    const error = new Error('Invalid id')
                error.statusCode=422;
                throw error;
                }
               return Product.findByIdAndDelete(product_id)
            }).then(deletedProduct=>{
                res.json({message:'Product Deleted Successfully'})
            }).catch(err=>{
                err.statusCode=500
                next(err)
            })
        }

        // exports.getOrderDetails=(req,res,next)=>{
        //     const id=req.params.id
        //     Order.findById(id).populate('user','name email').then(result=>{
        //         if(!result){
        //         const error = new Error('Invalid order id')
        //         error.statusCode=422;
        //         throw error;
        //         }
        //         res.json({'Order Details':result})
        //     }).catch(err=>{
        //         err.statusCode=500
        //         next(err)
        //     })
        // }

        exports.getAllOrders=(req,res,next)=>{
            let totalAmt=0
            Order.find().then(result=>{
                result.forEach(order=>{
                    totalAmt=totalAmt+order.totalPrice
                })
                res.json({orders:result,
                totalAmount:totalAmt})
            }).catch(err=>{
                err.statusCode=500
                next(err)
            })
        }

       exports.update  