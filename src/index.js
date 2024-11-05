require("dotenv").config();
const PORT = process.env.PORT || 5000;
const express = require("express");

const app = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});
