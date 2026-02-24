import jwt from "jsonwebtoken"
import { handleError } from "../helpers/HandleError.js"

export const authenticate=async(req,res,next)=>{
    try {
        const token = req.cookies.access_token
        if(!token){
            return next(handleError(403,"unauthorized"))
        }
        const decodeToken = jwt.verify(token,process.env.JWT_SECRET)
        console.log("authenticate",decodeToken)
        req.user = decodeToken
        return next()
    } catch (error) {
        return next(handleError(500,error.message))
    }
}