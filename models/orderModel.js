import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType"
  },
  userType: {
    type: String,
    enum: ["User", "GuestUser"]
  },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: Number,
      size: String,
      image: [String]     
    }
  ],

  address: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: { type: String },
    fullAddress: { type: String, required: true }
  },

  note: { type: String, default: "" },

  amount: Number,
  deliveryCharge: Number,
  paymentMethod: { type: String, default: "COD" },
  payment: { type: Boolean, default: false },
  status: { type: String, default: "Pending" },
  trackingId: String,

  orderToken: { type: String, unique: true, required: true }

}, { timestamps: true });

orderSchema.index({ orderToken: 1 }, { unique: true });

export default mongoose.model("Order", orderSchema);
