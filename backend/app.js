const express = require("express");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "HELLO FROM APP.JS 🚀" });
});

module.exports = app;
