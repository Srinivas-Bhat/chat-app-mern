const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../Controllers/chatController");

const chatRoute = express.Router();

chatRoute.post("/", protect, accessChat); //for accessing or creating the chat with protect middleware
chatRoute.get("/", protect, fetchChats); // get all of the chat for a particular user
chatRoute.post("/group", protect, createGroupChat); 
chatRoute.put("/rename", protect, renameGroup); 
chatRoute.put("/add", protect, addToGroup); 
chatRoute.put("/remove", protect, removeFromGroup); 







module.exports = chatRoute