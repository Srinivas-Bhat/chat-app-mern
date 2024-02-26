const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
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
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5005;

const server = app.listen(PORT, () => {
  console.log("Server started");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"))
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });

  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  })

});
