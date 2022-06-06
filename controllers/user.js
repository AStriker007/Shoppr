const Order = require('../models/order')
const Product=require('../models/products')

exports.getAllProducts=(req,res,next)=>{
    const obj={}
    let page=1
    let size=2
    if(req.query.keyword){
        obj.$or=[
            {'name':{$regex:req.query.keyword,$options:'i'}},
            {'category':{$regex:req.query.keyword,$options:'i'}},
            {'description':{$regex:req.query.keyword,$options:'i'}}
        ]
    }
    if(req.query.category){
        obj.category=req.query.category
    }
    if(req.query.price){
        let price=JSON.stringify(req.query.price)
        let newPrice=price.replace(/\b(gt|gte|lt|lte)\b/g,value=>'$'+value)
        obj.price=JSON.parse(newPrice)
    }
    if(req.query.page){
        page=req.query.page
    }
    if(req.query.size){
        size=req.query.size
    }
Product.find(obj).limit(size).skip(((page-1)*size)).then(products=>{
    res.json({page:page,size:size,products:products})
}).catch(err=>{
    err.statusCode=500
})
}

exports.getProductDetails=(req,res,next)=>{
const product_id=req.params.id 
Product.findById(product_id).then(product=>{
    if(!product){
        const error = new Error('Invalid id')
                error.statusCode=422;
                throw error;
    }
    return Product.findById(product_id)
}).then(product=>{
    res.json({product:product})
}).catch(err=>{
   err.statusCode=500
    next(err)
})
}

exports.review=(req,res,next)=>{
Product.findById(req.body.product_id).then(product=>{
    if(!product){
        const error = new Error('Product not found')
                error.statusCode=422;
                throw error;
    }
    const reviewed=product.reviews.find((element)=>{
        element.userID.toString()===req.body.user_id.toString()
    })
    if(reviewed){
        product.reviews.forEach(element => {
            if(element.userID.toString()===req.body.user_id.toString()){
                element.rating=req.body.rating
                element.review=req.body.review
            }
        });
    }
    else{
        product.reviews.push({
            userID:req.body.user_id,
            rating:req.body.rating,
            review:req.body.review    
        })
    }
    let avg=0
    product.reviews.forEach(element=>{
        avg+=element.rating
    })
    avg=avg/(product.reviews.length)
    product.rating=avg
    return product.save()  
}).then(result=>{
    res.json({message:"Review added successfully"})
}).catch(err=>{
    err.statusCode=500
    next(err)
})
}

exports.createOrder=(req,res,next)=>{
const {shippingInfo,orderItems,
    paymentInfo,itemsPrice,
    taxPrice,shippingPrice,
    totalPrice,id}=req.body

    const order=new Order({
        shippingInfo:shippingInfo,
        orderItems:orderItems,
        paymentInfo:paymentInfo,
        itemsPrice,
        taxPrice:taxPrice,
        shippingPrice:shippingPrice,
        totalPrice:totalPrice,
        paidAt:Date.now(),
        user:id
    })
    order.save().then(result=>{
        res.json({message:"Order Placed",
        order:result})
    }).catch(err=>{
        err.statusCode=500
        next(err)
    })
}

exports.getOrders=(req,res,next)=>{
    Order.find({id:req.body.id}).then(orders=>{
        if(!orders){
            const error = new Error('Invalid user id')
            error.statusCode=422;
            throw error;           
        }
        res.json({orders:orders})
    }).catch(err=>{
        err.statusCode=500
        next(err)
    })
}