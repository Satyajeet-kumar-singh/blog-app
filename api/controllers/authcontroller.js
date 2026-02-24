import jwt from "jsonwebtoken"
import { handleError } from "../helpers/HandleError.js"
import User from "../models/usermodel.js"
import bcryptjs from "bcryptjs"


export const Register=async(req,res,next)=>{
    try {
        const {name,email,password} = req.body
        const checkUser = await User.findOne({email})
        if(checkUser){
            //user already exists
           return next(handleError(409,"user already registered"))
        }

        const hashedPassword = bcryptjs.hashSync(password) 
        //registered user
        const user = new User({
            name:name,
            email:email,
            password:hashedPassword
        })

        await user.save()

        res.status(200).json({
            success:true,
            message:"registration successfull"
        })
    } catch (error) {
        next(handleError(500,error.message))
    }
}

export const Login=async(req,res,next)=>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return next(handleError(404,"invalid login credentials"))
        }

        const hashedPassword = user.password
        const comparePassword = bcryptjs.compare(password,hashedPassword)

        if(!comparePassword){
           return next(handleError(404,"invalid login credentials"))
        }

        //jwt token
        const token = jwt.sign({
            _id:user.id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role
        },process.env.JWT_SECRET)

        res.cookie("access_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            path:"/"
        })

        const newUser = user.toObject({getters:true})
        delete newUser.password
        res.status(200).json({
            success:true,
            user:newUser,
            message:"login successfull"
        })

    } catch (error) {
        next(handleError(500,error.message))
    }
}

export const GoogleLogin=async(req,res,next)=>{
    try {
        const {name,email,avatar} = req.body
        let user
        user = await User.findOne({email})
        if(!user){
            const password = Math.random().toString()
            const hashedPassword = bcryptjs.hashSync(password)
            //create new user
            const newUser = new User({
                name:name,
                email:email,
                password:hashedPassword,
                avatar:avatar
            })

            user = await newUser.save()
        }

        //jwt token
        const token = jwt.sign({
            _id:user.id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role
        },process.env.JWT_SECRET)

        res.cookie("access_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            path:"/"
        })

        const newUser = user.toObject({getters:true})
        delete newUser.password
        res.status(200).json({
            success:true,
            user:newUser,
            message:"login successfull"
        })

    } catch (error) {
        next(handleError(500,error.message))
    }
}

export const Logout=async(req,res,next)=>{
    try {
        res.clearCookie("access_token",{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            path:"/"
        })

        res.status(200).json({
            success:true,
            message:"logout successfull"
        })
    } catch (error) {
        next(handleError(500,error.message))
    }
}