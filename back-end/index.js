const express = require("express");
const dotenv = require("dotenv");
const {chats} = require("./data/data");
const connectDB = require("./config/db");
const userRoute = require("./Routes/userRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("api started");
})

app.use("/api/user", userRoute)
app.use("/api/chat", chatRoute)
app.use("/api/message", messageRoute)

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log("Server started");
})