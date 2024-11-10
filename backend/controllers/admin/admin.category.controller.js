import mongoose from 'mongoose';
import Category from '../../models/admin/admin.category.model.js';
import Product from '../../models/product.model.js';
import Blacklist from '../../models/blacklist/blacklist.model.js';

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ success: false, message: "No token provided." });
    
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: "Token not found." });

    const isBlacklisted = await Blacklist.findOne({ token });
    if (isBlacklisted) return res.status(401).json({ success: false, message: "Token has been logged out." });
    
    req.token = token;
    next();
};

export const viewCategories = [verifyToken, async (req, res) => {
    try {
        const categories = await Category.find({});
        return res.status(200).json({ success: true, data: categories || [] });
    } catch (error) {
        console.error("Error fetching all categories:", error.message);
        return res.status(500).json({ success: false, message: "Server error." });
    }
}];

export const viewCategory = [verifyToken, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        const products = await Product.find({ category: id });
        return res.status(200).json({ success: true, data: { products, category } });
    } catch (error) {
        console.error("Error fetching category:", error.message);
        return res.status(500).json({ success: false, message: "Server error." });
    }
}];

export const addCategory = [verifyToken, async (req, res) => {
    const { categoryName } = req.body;
    if (!categoryName) return res.status(400).json({ success: false, message: "Please provide the category name." });

    try {
        const newCategory = new Category({ categoryName });
        await newCategory.save();
        return res.status(201).json({ success: true, message: "Category added successfully.", data: newCategory });
    } catch (error) {
        console.error("Error adding new category:", error.message);
        return res.status(500).json({ success: false, message: "Server error." });
    }
}];

export const updateCategory = [verifyToken, async (req, res) => {
    const { id } = req.params;
    const { categoryName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    try {
        const updatedCategory = await Category.findByIdAndUpdate( id, { categoryName },{ new: true });

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        return res.status(200).json({ success: true, message: "Category updated successfully.", data: updatedCategory });
    } catch (error) {
        console.error("Error updating category:", error.message);
        return res.status(500).json({ success: false, message: "Server error." });
    }
}];

export const deleteCategory = [verifyToken, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid category ID." });
    }

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }

        return res.status(200).json({ success: true, message: "Category deleted successfully." });
    } catch (error) {
        console.error("Error deleting category:", error.message);
        return res.status(500).json({ success: false, message: "Server error." });
    }
}];