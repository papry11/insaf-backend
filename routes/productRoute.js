import express from 'express';
import { listProducts, addProduct, singleProduct, removeProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

// Add Product (Admin Protected)
productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

// Public Routes
productRouter.get('/list', listProducts);
productRouter.post('/single', singleProduct);

// Remove Product (Admin Protected)
productRouter.post('/remove', adminAuth, removeProduct);

export default productRouter;
