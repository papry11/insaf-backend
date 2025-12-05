import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
}, { timestamps: true });

const categoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default categoryModel;
