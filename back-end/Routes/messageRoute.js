const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, allMessage } = require("../Controllers/messageController");


const messageRoute = express.Router();

messageRoute.post("/", protect, sendMessage);
messageRoute.get("/:chatId", protect, allMessage);

















module.exports = messageRoute;