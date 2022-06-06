const mongoose=require('mongoose')
const express =require('express')
const dotenv =require('dotenv')
dotenv.config();
const app = express()
const authRouter=require('./routes/auth')
const adminRouter=require('./routes/admin')
const userRouter=require('./routes/user')
app.use(express.json())

app.use('/auth',authRouter)
app.use('/admin',adminRouter)
app.use('/user',userRouter)

app.use((error,req,res,next)=>{
console.log(error)
const status=error.statusCode;
const message=error.message;
const data=error.data;
if(data)
{
    return res.status(status).json({"message":message,"data":data})
}
else{
    return res.status(status).json({"message":message})
}
});
mongoose.connect(process.env.MONGO_URL).then(result=>{
console.log("Connected")    
app.listen(process.env.PORT,()=>{
    console.log(`Listening to port ${process.env.PORT}`)
})
}).catch(err=>{
    console.log(err)
});