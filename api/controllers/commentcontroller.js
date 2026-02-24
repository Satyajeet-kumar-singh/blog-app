import { handleError } from "../helpers/HandleError.js"
import Comment from "../models/commentmodel.js"

export const addComment=async(req,res,next)=>{
    try {
        const { author,blogid,comment } = req.body
        const newComment = new Comment({
            author:author,
            blogid:blogid,
            comment:comment
        })
        await newComment.save()
        res.status(200).json({
            success:true,
            message:"comment sunmited",
            comment:newComment
        })
    } catch (error) {
        return next(handleError(500,error.message))
    }
}

export const getComments=async(req,res,next)=>{
    try {
        const { blogid } = req.params
        const comments = await Comment.find({blogid}).populate("author","name avatar").sort({createAt:-1}).lean().exec()
        res.status(200).json({
            comments:comments
        })
    } catch (error) {
        return next(handleError(500,error.message))
    }
}

export const commentCount=async(req,res,next)=>{
    try {
        const { blogid } = req.params
        const commentCount = await Comment.countDocuments({blogid})
        res.status(200).json({
            commentCount:commentCount
        })
    } catch (error) {
        return next(handleError(500,error.message))
    }
}

export const getAllComments=async(req,res,next)=>{
    try {
        const user = req.user
        // console.log("comment controller",user)
        let comments
        if(user.role === "admin"){
            comments = await Comment.find().populate("blogid","name").populate("author","name")
        }else{
            comments = await Comment.find({author:user._id}).populate("blogid","name").populate("author","name")
        }
        res.status(200).json({
            comments
        })
    } catch (error) {
        return next(handleError(500,error.message))
    }
}

export const deleteComment=async(req,res,next)=>{
    try {
        const {commentId} = req.params
        await Comment.findByIdAndDelete(commentId)
        res.status(200).json({
            success:true,
            message:"data deleted"
        })
    } catch (error) {
        return next(handleError(500,error.message))
    }
}