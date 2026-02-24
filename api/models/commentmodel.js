import mongoose from "mongoose"

const commentSchema = mongoose.Schema({
    author: {type:mongoose.Schema.Types.ObjectId,required:true,ref:"user"},
    blogid: {type:mongoose.Schema.Types.ObjectId,required:true,ref:"Blog"},
    comment: {type:String , required:true , trim:true},
},{timestamps:true})

const Comment = mongoose.model("Comment",commentSchema,"comments")
export default Comment
