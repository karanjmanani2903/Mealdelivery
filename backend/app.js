const express = require("express");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
const mealRoutes = require("./routes/mealRoutes");
const planRoutes = require("./routes/planRoutes"); // 👈 ADD THIS

app.use("/api/meals", mealRoutes);
app.use("/api/plans", planRoutes); // 👈 ADD THIS

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "HELLO FROM APP.JS 🚀" });
});

module.exports = app;