import express from "express"
import { addBlog, deleteBlog, editBlog, getAllBlogs, getBlog, getBlogByCategory, getRelatedBlog, search, showAllBlog, updateBlog } from "../controllers/blogcontroller.js"
import upload from "../config/multer.js"
import { authenticate } from "../middleware/authenticate.js"

const blogRoute = express.Router()

blogRoute.post("/add",authenticate,upload.single("file"),addBlog)
blogRoute.get("/edit/:blogid",authenticate,editBlog)
blogRoute.put("/update/:blogid",authenticate,upload.single("file"),updateBlog)
blogRoute.delete("/delete/:blogid",authenticate,deleteBlog)
//protected route
blogRoute.get("/get-all",authenticate,showAllBlog)
blogRoute.get("/get-blog/:slug",getBlog)
blogRoute.get("/get-related-blog/:category/:blog",getRelatedBlog)
blogRoute.get("/get-blog-by-category/:category",getBlogByCategory)
blogRoute.get("/search",search)

//public route
blogRoute.get("/blogs",getAllBlogs)

export default blogRoute