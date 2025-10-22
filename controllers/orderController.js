

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
    const { fullName, phone, alternatePhone, fullAddress, items, orderToken } = req.body;
    const deliveryCharge = req.body.shippingCharge || req.body.deliveryCharge || 0;

    if (!fullName || !phone || !fullAddress || !items || !orderToken) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 🔹 Check duplicate order
    const existingOrder = await Order.findOne({ orderToken });
    if (existingOrder) {
      return res.status(400).json({ success: false, message: "Duplicate order detected" });
    }

    // 🔹 Calculate product total
    let totalProductPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId).select("price");
      if (product) totalProductPrice += product.price * (item.quantity || 1);
    }

    const finalAmount = totalProductPrice + deliveryCharge;

    // 🔹 Create guest user
    const guestUser = await GuestUser.create({ fullName, phone, fullAddress, alternatePhone });

    const trackingId = uuidv4();

    // 🔹 Prepare items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId).select("image name price");
        let productImage = "";
        if (product) productImage = Array.isArray(product.image) ? product.image[0] : product.image;

        return {
          product: item.productId,
          name: product ? product.name : item.name,
          price: product ? product.price : item.price,
          quantity: item.quantity || 1,
          size: item.size,
          image: productImage,
        };
      })
    );

    // 🔹 Save order with alternatePhone
    const order = await Order.create({
      user: guestUser._id,
      userType: "GuestUser",
      items: orderItems,
      address: { 
        fullName, 
        phone, 
        alternatePhone: alternatePhone || "", // ✅ added
        fullAddress 
      },
      note: req.body.note || "",
      amount: finalAmount,
      trackingId,
      paymentMethod: "COD",
      payment: false,
      status: "Pending",
      orderToken // ✅ store token
    });

    res.status(201).json({ success: true, trackingId, order });

  } catch (error) {
    console.error("Guest Order Error:", error.message);
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

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in the order" });
    }

    const userId = req.userId || null;

    // 🛒 Prepare items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId).select("image name price");

        let productImage = "";
        if (product) {
          if (Array.isArray(product.image)) {
            productImage = product.image[0];
          } else {
            productImage = product.image;
          }
        }

        return {
          product: item.productId,
          name: product ? product.name : item.name,
          price: product ? product.price : item.price,
          quantity: item.quantity || item.qty || 1,
          size: item.size,
          image: productImage,
        };
      })
    );

    // 🛒 Calculate total
    let totalProductPrice = 0;
    orderItems.forEach(item => {
      totalProductPrice += item.price * item.quantity;
    });

    const trackingId = uuidv4();

    // 🛒 Save order
    const order = await Order.create({
      user: userId,
      userType: "User",
      items: orderItems,
      address,
      amount: totalProductPrice,
      trackingId,
      paymentMethod: "COD",
      payment: false,
      status: "Pending",
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




