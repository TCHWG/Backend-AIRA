require("dotenv").config();
const PORT = process.env.PORT || 5000;
const apiErrorHandler = require("./errors/apiErrorHandler");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const musicRoutes = require("./routes/musicRoutes");

const extractUser = require('./middleware/extractUserMiddleware');
const express = require('express');
const app = express();
const cors = require("cors");


app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Use the auth routes
app.use("/api/auth", authRoutes);
// Use the user routes
app.use("/api", extractUser, userRoutes);

app.use("/api/musics", extractUser, musicRoutes)

app.use(apiErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});
