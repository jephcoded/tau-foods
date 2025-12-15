const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", FoodSchema);
