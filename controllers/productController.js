import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModels.js';

// Product add function
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Check required fields
        if (!name || !description || !price || !category || !subCategory || !sizes) {
            return res.json({ success: false, message: "All fields are required." });
        }

        // Get images from req.files
        const images = [
            req.files?.image1?.[0],
            req.files?.image2?.[0],
            req.files?.image3?.[0],
            req.files?.image4?.[0]
        ].filter(Boolean);

        if (images.length === 0) {
            return res.json({ success: false, message: "No valid images provided." });
        }

        // Upload images to Cloudinary concurrently
        const imagesUrl = await Promise.all(images.map(async (img) => {
            const result = await cloudinary.uploader.upload(img.path, { resource_type: 'image' });
            return result.secure_url;
        }));

        // Parse sizes (stringified JSON array)
        let parsedSizes;
        try {
            parsedSizes = JSON.parse(sizes);
            if (!Array.isArray(parsedSizes)) throw new Error();
        } catch {
            return res.json({ success: false, message: "Invalid sizes format. Must be a JSON array string." });
        }

        // Prepare product data
        const productData = {
            name,
            description,
            category,
            subCategory,
            price: Number(price),
            bestseller: bestseller === "true",
            sizes: parsedSizes,
            image: imagesUrl,
            date: Date.now()
        };

        // Save to DB
        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Product list function
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({}).sort({ date: -1 });
        res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// Product remove function
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.json({ success: false, message: "Product ID is required." });

        const deleted = await productModel.findByIdAndDelete(id);
        if (!deleted) return res.json({ success: false, message: "Product not found." });

        res.json({ success: true, message: "Product removed successfully." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Single product fetch function
const singleProduct = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) return res.json({ success: false, message: "Product ID is required." });

        const product = await productModel.findById(id);
        if (!product) return res.json({ success: false, message: "Product not found." });

        res.json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { listProducts, addProduct, singleProduct, removeProduct };
