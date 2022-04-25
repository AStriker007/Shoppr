const mongoose=require('mongoose')
const express =require('express')
const dotenv =require('dotenv')
dotenv.config();
const app = express()
const authRouter=require('./routes/auth')
app.use(express.json())

app.use('/auth',authRouter)

app.use((error,req,res,next)=>{
console.log(error)
const status=error.statusCode;
const message=error.message;
const data=error.data;
return res.status(status).json({"message":message,"data":data})
});
mongoose.connect('process.env.MONGO_URL').then(result=>{
console.log("Connected")    
app.listen(process.env.PORT,()=>{
    console.log(`Listening to port ${process.env.PORT}`)
})
}).catch(err=>{
    console.log(err)
});