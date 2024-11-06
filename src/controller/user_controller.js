const userModel = require("../models/user_model");
const ApiError = require("../errors/api_error");

const createUser = async (req, res, next) => {
  const { firebase_uid, name, email } = req.body;

  if (!firebase_uid || !name || !email) {
    const missingFields = [];
    if (!firebase_uid) missingFields.push("firebase_uid");
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");

    return next(
      ApiError.badRequest("Missing required fields", { missingFields })
    );
  }

  try {
    const result = await userModel.saveUser(firebase_uid, name, email);
    res.status(201).json({
      code: 201,
      status: "Created",
      message: "User created successfully",
      data: result,
      details: null,
    });
  } catch (error) {
    console.error("Error in createUser controller:", error.message);
    next(ApiError.internalServerError("Error creating user"));
  }
};

module.exports = {
  createUser,
};
