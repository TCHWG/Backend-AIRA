const userModel = require("../models/user_model");

const createUser = async (req, res) => {
  const { firebase_uid, name, email } = req.body;

  if (!firebase_uid || !name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const result = await userModel.saveUser(firebase_uid, name, email);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
};
