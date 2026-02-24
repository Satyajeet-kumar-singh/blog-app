import jwt from "jsonwebtoken"
import { handleError } from "../helpers/HandleError.js"

export const onlyAdmin=async(req,res,next)=>{
    try {
        const token = req.cookie.access_token
        if(!token){
            return next(handleError(403,"unauthorized"))
        }
        const decodeToken = jwt.verify(token,process.env.JWT_SECRET)
        if(decodeToken.role === "admin"){
            req.user = decodeToken
            next()
        }else{
            return next(handleError(403,"unauthorized"))
        }
    } catch (error) {
        return next(handleError(500,error.message))
    }
}