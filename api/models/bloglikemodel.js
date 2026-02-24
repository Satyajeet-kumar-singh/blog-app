import mongoose from "mongoose"

const likeSchema = mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId,required:true,ref:"user"},
    blogid: {type:mongoose.Schema.Types.ObjectId,required:true,ref:"Blog"},
},{timestamps:true})

const BlogLike = mongoose.model("blogLike",likeSchema,"blogLikes")
export default BlogLike
