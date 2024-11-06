require("dotenv").config();
const PORT = process.env.PORT || 5000;
const apiErrorHandler = require("./errors/api_error_handler");
const userRoutes = require("./routes/user_router");
const express = require("express");

const app = express();

app.use(express.json());

app.use("/user", userRoutes);

app.use(apiErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});
