// import mongoose from "mongoose";

// const guestUserSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   phone: String,
//   address: String,
// }, { timestamps: true });

// export default mongoose.model("GuestUser", guestUserSchema);

import mongoose from "mongoose";

const guestUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  fullAddress: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("GuestUser", guestUserSchema);

