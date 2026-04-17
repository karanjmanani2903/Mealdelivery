const express = require("express");
const router = express.Router();

const WeeklyPlan = require("../models/WeeklyPlan");
const Meal = require("../models/Meal");

// Create Weekly Plan
router.post("/", async (req, res) => {
  try {
    const { user, meals, weekStartDate, servings = 1 } = req.body;

    // Validation
    if (!user || !meals || meals.length === 0 || !weekStartDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Prevent duplicate meals
    const uniqueMeals = [...new Set(meals)];
    if (uniqueMeals.length !== meals.length) {
      return res.status(400).json({ error: "Duplicate meals not allowed" });
    }

    // Prevent duplicate weekly plan
    const existingPlan = await WeeklyPlan.findOne({
      user,
      weekStartDate,
    });

    if (existingPlan) {
      return res.status(400).json({
        error: "Plan already exists for this week",
      });
    }

    // Fetch meal data
    const mealDocs = await Meal.find({ _id: { $in: meals } });

    if (mealDocs.length !== meals.length) {
      return res.status(400).json({ error: "Invalid meal IDs provided" });
    }

    const unitConversion = {
        g: { base: "g", factor: 1 },
        kg: { base: "g", factor: 1000 },
        ml: { base: "ml", factor: 1 },
        l: { base: "ml", factor: 1000 },
    };

    // Aggregate ingredients (SMART VERSION)
    const ingredientMap = {};

    for (const meal of mealDocs) {
      for (const ing of meal.ingredients) {
        const name = ing.name;

        const match = ing.quantity.match(/^(\d+)\s*([a-zA-Z]+)/);
        if (!match) continue;

        let value = parseInt(match[1]) * servings;
        let unit = match[2].toLowerCase();
        
        // Convert if possible
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

    // Convert to structured format
    const finalIngredients = {};

    for (let key in ingredientMap) {
      finalIngredients[key] = {
        total: ingredientMap[key].total,
        unit: ingredientMap[key].unit,
      };
    }

    // Calculate total price
    const totalPrice = mealDocs.reduce(
      (sum, meal) => sum + meal.basePrice,
      0
    );

    // Create plan
    const plan = new WeeklyPlan({
      user,
      meals,
      weekStartDate,
      totalPrice,
      servings,
    });

    const savedPlan = await plan.save();

    // Final response
    res.status(201).json({
      plan: savedPlan,
      ingredients: finalIngredients,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all plans with meal details
router.get("/", async (req, res) => {
  try {
    const plans = await WeeklyPlan.find().populate("meals");
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;