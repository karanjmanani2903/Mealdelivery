const mongoose = require("mongoose");

const weeklyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },

    meals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal",
      },
    ],

    weekStartDate: {
      type: Date,
      required: true,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    servings: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WeeklyPlan", weeklyPlanSchema);