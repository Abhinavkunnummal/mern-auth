import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.Mongo).then(()=>{
    console.log('Connected to MongoDB')
}).catch((err)=>{
    console.log(err)
})

mongoose.connect
const app=express()

app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})