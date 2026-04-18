const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const mealRoutes = require("./routes/mealRoutes");
const planRoutes = require("./routes/planRoutes");
const orderRoutes = require("./routes/orderRoutes");


app.use("/api/meals", mealRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/orders", orderRoutes);


// Health check
app.get("/health", (req, res) => {
  res.json({ status: "HELLO FROM APP.JS 🚀" });
});

module.exports = app;