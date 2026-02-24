import { handleError } from "../helpers/HandleError.js";
import Blog from "../models/blogmodel.js";
import cloudinary from "../config/cloudinary.js";
import { encode } from "entities";
import Category from "../models/categorymodel.js";

export const addBlog = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    let featuredImage = "";
    if (req.file) {
      //upload an image
      const result = await cloudinary.uploader
        .upload(req.file.path, {
          folder: "blog-file",
          resource_type: "auto",
        })
        .catch((error) => {
          return next(handleError(500, error.message));
        });
      featuredImage = result.secure_url;
    }

    const blog = new Blog({
      author: data.author,
      category: data.category,
      name: data.title,
      slug: data.slug,
      featuredImage: featuredImage,
      blogContent: encode(data.blogContent),
    });

    await blog.save();

    res.status(200).json({
      success: true,
      message: "blog added successfully",
    });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};

export const editBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const blog = await Blog.findById(blogid).populate("category", "name");
    if (!blog) {
      next(handleError(404, "data not found"));
    }
    res.status(200).json({
      blog: blog,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const {blogid} = req.params
    const data = JSON.parse(req.body.data);
    const blog = await Blog.findById(blogid)

    blog.category = data.category
    blog.title = data.title
    blog.slug = data.slug
    blog.blogContent = data.blogContent

    let featuredImage = blog.featuredImage;
    if (req.file) {
      //upload an image
      const result = await cloudinary.uploader
        .upload(req.file.path, {
          folder: "blog-file",
          resource_type: "auto",
        })
        .catch((error) => {
          return next(handleError(500, error.message));
        });
      featuredImage = result.secure_url;
    }

    blog.featuredImage = featuredImage

    await blog.save()

    res.status(200).json({
      success: true,
      message: "blog updated successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    await Blog.findByIdAndDelete(blogid); //to get the updated data else it get the old data

    res.status(200).json({
      success: true,
      message: "blog deleted successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const showAllBlog = async (req, res, next) => {
  try {
    console.log("show all blog",req.user)
    const user = req.user
    let blog;
    if(user.role === "admin"){
      blog = await Blog.find()
       .populate("author", "name avatar role")
       .populate("category", "name slug")
       .sort({ createdAt: -1 })
       .lean()
       .exec();
    }else{
      blog = await Blog.find({author:user._id})
       .populate("author", "name avatar role")
       .populate("category", "name slug")
       .sort({ createdAt: -1 })
       .lean()
       .exec();
    }
    res.status(200).json({
      blog: blog,
    });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};

export const getBlog=async(req,res,next)=>{
  try {
    const { slug } = req.params
    const blog = await Blog.findOne({slug}).populate("author","name avatar role").populate("category","name slug").lean().exec()
    res.status(200).json({
      blog: blog
    })
  } catch (error) {
    return next(handleError(500,error.message))
  }
}

export const getRelatedBlog=async(req,res,next)=>{
  try {
    const { category,blog } = req.params
    const categoryData = await Category.findOne({slug:category})
    if(!categoryData){
      return next(handleError(404,"category data not found"))
    }
    const categoryId = categoryData._id
    const relatedBlog = await Blog.find({category:categoryId,slug:{$ne:blog}}).lean().exec()
    res.status(200).json({
      relatedBlog: relatedBlog
    })
  } catch (error) {
    return next(handleError(500,error.message))
  }
}

export const getBlogByCategory=async(req,res,next)=>{
  try {
    const { category} = req.params
    const categoryData = await Category.findOne({slug:category}) 
    if(!categoryData){
      return next(handleError(404,"category data not found"))
    }
    const categoryId = categoryData._id
    const blog = await Blog.find({category:categoryId}).populate("author","name avatar role").populate("category","name slug").lean().exec()
    res.status(200).json({
      blog: blog,
      categoryData:categoryData
    })
  } catch (error) {
    return next(handleError(500,error.message))
  }
}

export const search =async(req,res,next)=>{
  try {
    const { q } = req.query
    
    const blog = await Blog.find({name:{$regex:q,$options:"i"}}).populate("author","name avatar role").populate("category","name slug").lean().exec()
    res.status(200).json({
      blog
    })
  } catch (error) {
    return next(handleError(500,error.message))
  }
}

export const getAllBlogs = async (req, res, next) => {
  try {
    const blog = await Blog.find()
       .populate("author", "name avatar role")
       .populate("category", "name slug")
       .sort({ createdAt: -1 })
       .lean()
       .exec();
    
    res.status(200).json({
      blog: blog,
    });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};