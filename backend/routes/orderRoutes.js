const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const WeeklyPlan = require("../models/WeeklyPlan");
const Meal = require("../models/Meal");

// Create Order from Plan
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

    // Fetch meals again (to rebuild ingredients safely)
    const mealDocs = await Meal.find({ _id: { $in: plan.meals } });

    // Recreate ingredient aggregation (same logic)
    const ingredientMap = {};

    const unitConversion = {
      g: { base: "g", factor: 1 },
      kg: { base: "g", factor: 1000 },
      ml: { base: "ml", factor: 1 },
      l: { base: "ml", factor: 1000 },
    };

    for (const meal of mealDocs) {
      for (const ing of meal.ingredients) {
        const name = ing.name;

        const match = ing.quantity.match(/^(\d+)\s*([a-zA-Z]+)/);
        if (!match) continue;

        let value = parseInt(match[1]) * plan.servings;
        let unit = match[2].toLowerCase();

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

module.exports = router;