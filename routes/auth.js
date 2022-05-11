const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const User = require('../models/user')
const authControllers=require('../controllers/auth')

router.post('/signup', [body('name').trim().exists({ checkFalsy: true })
    .withMessage("Please enter a valid name"), body('email').isEmail()
        .withMessage('Please enter a valid email').custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email already exists')
                }
            })
        }), body('password')
            .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,12}/)
            .withMessage("Password should be 8 to 12 characters long and should contain at least one uppercase one lowercase one digit and one special character")],authControllers.signup)          
            
router.post('/login',authControllers.login)   
router.get('/google',authControllers.redirect)
router.get('/google/redirect',authControllers.generateInfo)
router.post('/forgotPassword',authControllers.forgotPassword)
router.post('/enterOtp',authControllers.enterOtp)
router.post('/resetPassword',authControllers.resetPassword)

            
module.exports = router