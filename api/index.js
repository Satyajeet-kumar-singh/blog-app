import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongoose from "mongoose"
import AuthRoute from "./routes/authroute.js"
import userRoute from "./routes/userroute.js"
import CategoryRoute from "./routes/categoryroute.js"
import blogRoute from "./routes/blogroute.js"
import CommentRoute from "./routes/commentroute.js"
import blogLikeRoute from "./routes/bloglikeroute.js"


dotenv.config();

const app = express()
const PORT = process.env.PORT
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))

//route setup 
app.use("/api/auth",AuthRoute)
app.use("/api/user",userRoute)
app.use("/api/category",CategoryRoute)
app.use("/api/blog",blogRoute)
app.use("/api/comment",CommentRoute)
app.use("/api/blog-like",blogLikeRoute)

mongoose.connect(process.env.MONGODB_CONNECT)
.then(()=>console.log("database connected successfully"))
.catch((error)=>console.log("databse connection failed",error))


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "internal server error."
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})

app.listen(PORT,()=>{
    console.log("server rinning at PORT 3000")
})