const express = require("express");
const router = express.Router();

const Meal = require("../models/Meal");

// Create Meal
router.post("/", async (req, res) => {
  try {
    const meal = new Meal(req.body);
    const savedMeal = await meal.save();

    res.status(201).json(savedMeal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all meals
router.get("/", async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;