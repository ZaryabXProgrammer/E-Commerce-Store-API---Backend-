const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    quantity: { type: Number, required: true },

    total: { type: Number, required: true },

    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: {
          type: String,
          required: true, // Modify this as needed
        },
        size: {
          type: String,
          required: true, // Modify this as needed
        },
        title: {
          type: String,
        },
        desc: {
          type: String,
        },
        img: {
          type: String,
        },
        categories: {
          type: [String],
        },
        price: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
