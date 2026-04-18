const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const WeeklyPlan = require("../models/WeeklyPlan");
const Meal = require("../models/Meal");

// ==============================
// CREATE ORDER FROM PLAN
// ==============================
router.post("/", async (req, res) => {
  try {
    const { user, planId } = req.body;

    if (!user || !planId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch plan
    const plan = await WeeklyPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // Fetch meals
    const mealDocs = await Meal.find({ _id: { $in: plan.meals } });

    const ingredientMap = {};

    const unitConversion = {
      g: { base: "g", factor: 1 },
      kg: { base: "g", factor: 1000 },
      ml: { base: "ml", factor: 1 },
      l: { base: "ml", factor: 1000 },
    };

    // Aggregate ingredients
    for (const meal of mealDocs) {
      for (const ing of meal.ingredients) {
        const name = ing.name;

        const match = ing.quantity.match(/(\d+)/);
        
        if (!match) continue;
        let value = parseInt(match[1]) * plan.servings;
        let unit = ing.quantity.replace(match[1], "").trim().toLowerCase();
        if (!unit) unit = "unit";

        if (unitConversion[unit]) {
          value = value * unitConversion[unit].factor;
          unit = unitConversion[unit].base;
        }

        if (!ingredientMap[name]) {
          ingredientMap[name] = { total: value, unit };
        } else {
          if (ingredientMap[name].unit !== unit) {
            return res.status(400).json({
              error: `Unit mismatch for ${name}`,
            });
          }
          ingredientMap[name].total += value;
        }
      }
    }

    // Format ingredients
    const finalIngredients = {};
    for (let key in ingredientMap) {
      finalIngredients[key] = {
        total: ingredientMap[key].total,
        unit: ingredientMap[key].unit,
      };
    }

    // Create Order
    const order = new Order({
      user,
      plan: plan._id,
      ingredients: finalIngredients,
      totalPrice: plan.totalPrice,
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("plan");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE ORDER STATUS
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;