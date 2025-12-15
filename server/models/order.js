const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalPrice: Number,
    status: { type: String, default: "pending" },

    // 🔥 PAYMENT METHOD
    paymentMethod: {
      type: String,
      default: "Cash",
    },

    // 🔥 LOCATION (NEW)
    campus: String,        // West Campus / East Campus
    hostel: String,        // Boys Hostel / Girls Hostel
    roomNumber: String,    // Room 215

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
