import express from "express";
import { addCategory, listCategory } from "../controllers/categoryController.js";
import adminAuth from "../middleware/adminAuth.js";

const categoryRouter = express.Router();

categoryRouter.post("/add", adminAuth, addCategory);
categoryRouter.get("/list", listCategory);

export default categoryRouter;
