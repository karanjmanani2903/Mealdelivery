require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT;
const connectDB = require("./config/db");

connectDB();
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

