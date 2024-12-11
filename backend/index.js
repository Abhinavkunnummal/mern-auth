import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
dotenv.config()

mongoose.connect(process.env.Mongo).then(()=>{
    console.log('Connected to MongoDB')
}).catch((err)=>{
    console.log(err)
})

const app=express()
app.use(express.json())

app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})

app.use('/backend/user',userRouter)
app.use('/backend/auth',authRoutes)


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message||'internal server error'; 
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    })
})