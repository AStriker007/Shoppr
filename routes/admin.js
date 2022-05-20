const express=require('express')
const router=express.Router()
const adminControllers=require('../controllers/admin')
const multer=require('../config/multer_config');

router.post('/addProduct',multer.array('image'),adminControllers.addProduct)

module.exports=router
