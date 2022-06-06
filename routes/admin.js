const express=require('express')
const router=express.Router()
const adminControllers=require('../controllers/admin')
const multer=require('../config/multer_config');
const { route } = require('express/lib/application');

router.post('/addProduct',multer.array('image'),adminControllers.addProduct)
router.patch('/products/:id',adminControllers.updateProduct)
router.delete('/products/:id',adminControllers.deleteProduct)
//router.get('/order/:id',adminControllers.getOrderDetails)

module.exports=router
