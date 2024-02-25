const express = require("express");
const { registerUser, loginUser, allUsers } = require("../Controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const userRoute = express.Router();

userRoute.post("/", registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/", protect, allUsers);







module.exports = userRoute