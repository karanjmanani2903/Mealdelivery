const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeeklyPlan",
      required: true,
    },

    ingredients: {
      type: Object, // aggregated ingredients
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);