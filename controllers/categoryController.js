import categoryModel from "../models/categoryModel.js";

// Add Category
export const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) return res.json({ success: false, message: "Category name required" });

        const exists = await categoryModel.findOne({ name });
        if (exists) return res.json({ success: false, message: "Category already exists" });

        const category = new categoryModel({ name });
        await category.save();

        res.json({ success: true, message: "Category added successfully" });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// List Category
export const listCategory = async (req, res) => {
    try {
        const cats = await categoryModel.find({});
        res.json({ success: true, categories: cats });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
