const { validationResult } = require('express-validator')
const jwt= require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const otpSchema=require('../models/otp')
const nodemailer=require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const googleConfig=require('../config/google_config')
const axios=require('axios')
const qs=require('query-string')
const dotenv =require('dotenv')
const user = require('../models/user')
const otpGenerator=require('otp-generator')
dotenv.config();

// const { send } = require('express/lib/response')

const transporter=nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:process.env.NODEMAILER_API_KEY
    }
}))

exports.signup = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validaiton failed')
        error.statusCode = 422
        error.data = errors.array()
        throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12).then(hash=>{
        const user = new User({
            name: name,
            email: email,
            password:hash
        });
       return user.save();
    }).then(result=>{
        const access=jwt.sign({
            id:result._id
        },process.env.ACCESS,{expiresIn:'900s'})
        const refresh=jwt.sign({
            id:result._id
        },process.env.REFRESH,{expiresIn:'1d'})

        res.status(201).json({message:'Signed Up Successfully',
    access_token:access,refresh_token:refresh})
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    });
}

exports.login=(req,res,next)=>{
const email=req.body.email;
const password=req.body.password;
let loadedUser;
User.findOne({email:email}).then(userDoc=>{
    if(!userDoc){
        const error = new Error('Invalid Email');
        error.statusCode=401;
        throw error;
    }
    loadedUser=userDoc;
   return bcrypt.compare(userDoc.password, password)
}).then(equal=>{
    if(!equal){
        const error = new Error('Invalid password')
        error.statusCode=401;
        throw error;
    }
    const access=jwt.sign({
        id:loadedUser._id
    },process.env.ACCESS,{expiresIn:'900s'})
    const refresh=jwt.sign({
        id:loadedUser._id
    },process.env.REFRESH,{expiresIn:'1d'})

    res.status(200).json({message:'logged in',access_token:access,refresh_token:refresh})
}).catch(err=>{
    if(!err.statusCode){
        err.statusCode=500
    }
    next(err)
})
}

exports.redirect=(req,res,next)=>{
    res.redirect(googleConfig.googleLoginUrl)
}
exports.generateInfo=(req,res,next)=>{
    const urlParams = qs.parse(req.url);
 let DATA,USERDOC;
    const code=urlParams['/google/redirect?code']
    googleConfig.getAccessTokenFromCode(code).then(access_token=>{
        return googleConfig.getGoogleUserInfo(access_token)
    }).then(data=>{
        DATA=data
       
        return User.findOne({email:data.email})
    })
    .then(userDoc=>{
        
        if(!userDoc){
            const user=new User({
                name:DATA.name,
                email:DATA.email,
                password:""
            })
            return user.save()
        }
        USERDOC=userDoc
    
    }).then(result=>{
        if(result)
        {
            const access=jwt.sign({
            id:result._id
        },process.env.ACCESS,{expiresIn:'900s'})
        const refresh=jwt.sign({
            id:result._id
        },process.env.REFRESH,{expiresIn:'1d'})
    
        res.status(200).json({message:'logged in',access_token:access,refresh_token:refresh})
    }
    else{
        const access=jwt.sign({
            id:USERDOC._id
        },process.env.ACCESS,{expiresIn:'900s'})
        const refresh=jwt.sign({
            id:USERDOC._id
        },process.env.REFRESH,{expiresIn:'1d'})
    
        res.status(200).json({message:'logged in',access_token:access,refresh_token:refresh})
    }
    })
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    });    
}

exports.forgotPassword=(req,res,next)=>{
const email=req.body.email;
User.findOne({email:email}).then(userDoc=>{
    if(!userDoc){
        const error = new Error('Email doesnot exist')
        error.statusCode=401;
        throw error;
    }
    const otp=otpGenerator.generate(6, { upperCaseAlphabets: false});
        const OTP=new otpSchema({  email:email,
            otp:otp,
            expiresIn:new Date().getTime()+300000})
           return OTP.save()
      
}).then(result=>{
    return transporter.sendMail({
        to:result.email,
        from:'aniruddh2010020@akgec.ac.in',
        subject:'OTP for password change',
        html:`<h1>Your otp is ${result.otp}</h1>`
    })
}).then(result=>{
    res.json({message:'OTP sent',email:email})
}).catch(err=>{
    if(!err.statusCode){
        err.statusCode=500
    }
    next(err)
})
}

exports.enterOtp=(req,res,next)=>{
const email=req.body.email;
const otp=req.body.otp;
otpSchema.find({email:email}).then(otpArray=>{
    const len=otpArray.length
    const latestOtpObj=otpArray[len-1]
    const latestOtp=latestOtpObj.otp
    if(otp==latestOtp){
        if(new Date().getTime()<=latestOtpObj.expiresIn){
            //Redirect to set new password page
        res.json({message:'Otp matched'})
        }
        else{
        const error = new Error('Otp Expired')
        error.statusCode=401;
        throw error;
        }
    }
    else{
        const error = new Error('Wrong Otp')
        error.statusCode=401;
        throw error;  
    }
}).catch(err=>{
    if(!err.statusCode){
        err.statusCode=500
    }
    next(err)
})
}

exports.resetPassword=(req,res,next)=>{
const email=req.body.email
const password=req.body.password
User.findOne({email:email}).then(userDoc=>{
    if(!userDoc){
        const error = new Error('Email doesnot exist')
        error.statusCode=401;
        throw error;
    }
   return bcrypt.hash(password,12)
    }).then(hash=>{
       return User.updateOne({email:email},{$set:{password:hash}})
    }).then(result=>{
        res.json({message:'Password updated'})
        //redirect to login
    }).catch(err=>{
        if(!err.statusCode){
            err.statusCode=500
        }
        next(err)
    })
}
