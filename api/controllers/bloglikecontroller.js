import { handleError } from "../helpers/HandleError.js"
import BlogLike from "../models/bloglikemodel.js"

export const doLike=async(req,res,next)=>{
    try {
        const {user,blogid} = req.body

        let like
        like = await BlogLike.findOne({user,blogid})
        if(!like){
            const saveLike = BlogLike({
                user:user,
                blogid:blogid
            })
            like = await saveLike.save()
        }else{
            await BlogLike.findByIdAndDelete(like._id)
        }

        const likeCount = await BlogLike.countDocuments({blogid})
        res.status(200).json({
            likeCount:likeCount
        })
    } catch (error) {
        return next(handleError(500,error.message))
    }
}

export const getLike=async(req,res,next)=>{
    try {
        const {blogid,userid} = req.params
        const likeCount = await BlogLike.countDocuments({blogid})

        let isUserLiked = false
        if(userid){
            const getUserLike = await BlogLike.countDocuments({blogid,user:userid})
            if(getUserLike > 0 ){
                isUserLiked = true
            }
        }

        res.status(200).json({
            likeCount:likeCount,
            isUserLiked: isUserLiked
        })
    } catch (error) {
        return next(handleError(500,error.message))
    }
}