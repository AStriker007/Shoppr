const express = require('express')
const router = express.Router()
const userControllers=require('../controllers/user')

router.get('/getAllProducts',userControllers.getAllProducts)

module.exports=router