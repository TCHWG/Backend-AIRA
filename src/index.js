require("dotenv").config();
const PORT = process.env.PORT || 5000;
const apiErrorHandler = require("./errors/apiErrorHandler");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const userMusicsRoutes = require("./routes/userMusicsRoutes");
const musicRoutes = require("./routes/musicRoutes");
const verifyToken = require("./middleware/authMiddleware");
const express = require('express');
const app = express();
const cors = require("cors");

app.set('trust proxy', 1);
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Use the auth routes
app.use("/api/auth", authRoutes);
// Use the user routes
app.use("/api", verifyToken, userRoutes);

// Use the musics routes
app.use("/api/musics", verifyToken, musicRoutes);

// Use the userMusic routes
app.use("/api/user/musics", verifyToken, userMusicsRoutes);

app.use(apiErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});