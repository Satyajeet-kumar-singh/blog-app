import { handleError } from "../helpers/HandleError.js";
import Category from "../models/categorymodel.js";

export const addCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const category = new Category({
      name: name,
      slug: slug,
    });
    await category.save();

    res.status(200).json({
      success: true,
      message: "category added successfully",
    });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};

export const showCategory = async (req, res, next) => {
  try {
    const { categoryid } = req.params;
    const category = await Category.findById(categoryid);
    if (!category) {
      next(handleError(404, "data not found"));
    }
    res.status(200).json({
      category: category,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { categoryid } = req.params;
    const { name, slug } = req.body;
    const category = await Category.findByIdAndUpdate(
      categoryid,
      {
        name,
        slug, //jisko update krna h
      },
      { new: true }
    ); //to get the updated data else it get the old data

    res.status(200).json({
      success: true,
      message: "category updated successfully",
      category: category,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { categoryid } = req.params;
    await Category.findByIdAndDelete(categoryid); //to get the updated data else it get the old data

    res.status(200).json({
      success: true,
      message: "category deleted successfully"
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const category = await Category.find().sort({ name: 1 }).lean().exec();
    res.status(200).json({
      category: category,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
