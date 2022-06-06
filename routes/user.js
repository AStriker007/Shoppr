const express = require('express')
const router = express.Router()
const userControllers=require('../controllers/user')

router.get('/getAllProducts',userControllers.getAllProducts)
router.get('/product/:id',userControllers.getProductDetails)
router.patch('/review',userControllers.review)
router.post('/order/new',userControllers.createOrder)
router.get('/orders',userControllers.getOrders)

module.exports=router