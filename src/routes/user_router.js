const express = require("express");
const userController = require("../controller/user_controller");

const router = express.Router();

router.post("/", userController.createUser);

module.exports = router;
