

import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from "../models/productModels.js";
import GuestUser from '../models/guestModel.js';
import { v4 as uuidv4 } from "uuid";


// // ===============================
// // ✅ Place Guest Order
// // ===============================

const placeGuestOrder = async (req, res) => {
  try {
    const { fullName, phone, alternatePhone, fullAddress, items, deliveryCharge, orderToken } = req.body;

    if (!fullName || !phone || !fullAddress || !items || !orderToken) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Prevent duplicate orders
    const exists = await Order.findOne({ orderToken });
    if (exists) {
      return res.status(400).json({ success: false, message: "Duplicate order" });
    }

    let totalProductPrice = 0;

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId).select("image name price");

        const productImages = Array.isArray(product.image)
          ? product.image
          : [product.image];

        totalProductPrice += product.price * item.quantity;

        return {
          product: item.productId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          size: item.size,
          image: productImages   // ✔ ALWAYS ARRAY
        };
      })
    );

    const guestUser = await GuestUser.create({
      fullName,
      phone,
      alternatePhone,
      fullAddress
    });

    const trackingId = uuidv4();
    const finalAmount = totalProductPrice + (deliveryCharge || 0);

    const order = await Order.create({
      user: guestUser._id,
      userType: "GuestUser",
      items: orderItems,
      address: { fullName, phone, alternatePhone, fullAddress },
      note: req.body.note || "",
      amount: finalAmount,
      deliveryCharge,
      trackingId,
      paymentMethod: "COD",
      orderToken
    });

    res.status(201).json({ success: true, trackingId, order });

  } catch (err) {
    console.log("Guest Order Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ===============================
// ✅ Track Guest Order
// ===============================
const trackOrder = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const order = await Order.findOne({ trackingId })
      .populate("user")
      .populate("items.product", "name price image size");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// ===============================
// ✅ Place Authenticated User Order
// ===============================
const placeOrder = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    let totalProductPrice = 0;

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId).select("image name price");

        const productImages = Array.isArray(product.image)
          ? product.image
          : [product.image];

        totalProductPrice += product.price * item.quantity;

        return {
          product: item.productId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          size: item.size,
          image: productImages     // ✔ ALWAYS ARRAY
        };
      })
    );

    const trackingId = uuidv4();

    const order = await Order.create({
      user: userId,
      userType: "User",
      items: orderItems,
      address,
      amount: totalProductPrice,
      paymentMethod: "COD",
      trackingId,
      status: "Pending"
    });

    res.status(201).json({ success: true, trackingId, order });

  } catch (error) {
    console.error("Place Order Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ===============================
// ✅ Get all orders (Admin)
// ===============================
const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user")
      .populate("items.product", "name price image size");

    res.json({ success: true, orders });
  } catch (error) {
    console.error("All Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===============================
// ✅ Get orders for logged-in user
// ===============================
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ user: userId })
      .populate("items.product", "name price image size");

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("User Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ===============================
// ✅ Update order status (Admin)
// ===============================
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: 'Status Updated' });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export {
  placeGuestOrder,
  trackOrder,
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
};




