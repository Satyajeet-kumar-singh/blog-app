import mongoose from "mongoose"

const blogSchema = mongoose.Schema({
    author: {type:mongoose.Schema.Types.ObjectId,required:true,ref:"user"},
    category: {type:mongoose.Schema.Types.ObjectId,required:true,ref:"Category"},
    name: {type:String , required:true , trim:true},
    slug: {type:String , required:true , unique:true , trim:true},
    blogContent: {type:String,required:true,trim:true},
    featuredImage: {type:String,required:true,trim:true}
},{timestamps:true})

const Blog = mongoose.model("Blog",blogSchema,"Blogs")
export default Blog
