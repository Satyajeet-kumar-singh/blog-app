import User from "../models/usermodel.js";
import { handleError } from "../helpers/HandleError.js";
import bcryptjs from "bcryptjs"

export const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const user = await User.findOne({ _id: userid }).lean().exec();
    if (!user) {
       next(handleError(404, "user not found"));
    }
    res.status(200).json({
      success: true,
      message: "user data found",
      user: user,
    });
  } catch (error) {
    next(handleError(500,error.message))
  }
};

export const updateUser=async(req,res,next)=>{
   try {
    const data = JSON.parse(req.body.data)
    const {userid} = req.params

    const user = await User.findById(userid)
    user.name = data.name
    user.email = data.email
    user.bio = data.bio

    if(data.paswword && data.paswword.length >= 0){
      const hashedPassword = bcryptjs.hashSync(data.paswword)
      user.password = hashedPassword
    }

    if(req.file){
      //upload an image
      const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog-file",
      resource_type: "auto"
      }).catch((error)=>{
        next(handleError(500,error.message))
      })
      user.avatar = result.secure_url
    }

    await user.save()

    const newUser = user.toObject({getters:true})
    delete newUser.password
    res.status(200).json({
      success:true,
      message:"data updated",
      user:newUser
    })
  } catch (error) {
    next(handleError(500,error.message))
  }
}

export const getAllUser=async(req,res,next)=>{
  try {
    const user = await User.find().sort({createdAt:-1})
    res.status(200).json({
      success:true,
      user
    })
  } catch (error) {
    next(handleError(500,error.message))
  }
}

export const deleteUser=async(req,res,next)=>{
  try {
    const {id} = req.params
    const user = await User.findByIdAndDelete(id)
    res.status(200).json({
      success:true,
      message:"data deleted"
    })
  } catch (error) {
    next(handleError(500,error.message))
  }
}