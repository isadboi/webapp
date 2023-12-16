const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require("dotenv").config({ path: require("find-config")(".env") });
const cookieParser = require("cookie-parser");
const userSockets = new Map();
const jwt = require("jsonwebtoken");
const transporter = require("./config/mailServer");
const colors = require("colors");
const connectDatabase = require("./config/mongoConnect");
const config = require("config");
const cors = require("cors");
//Route Imports
const indexRoutes = require("./routes");

const User = require("./models/User");
const globalMiddlewares = require("./middleware/globalMiddlewares");

connectDatabase();

//Middlewares
app.use(globalMiddlewares);

//Routes
app.use("/api/v1", indexRoutes);

//Error Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  console.log(err);
  res.status(err.statusCode).json({
    errors: { msg: err.message },
  });
});

//Socket Connection

io.on("connection", (socket) => {
  console.log("user connected");

  const token = socket.handshake.query.token;
  var user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
    userSockets.set(user.id, socket.id);
  } catch (err) {
    console.log(err.message);
  }

  if (user.role == "admin") {
    socket.on("create-conversation", async ({ recieverId }) => {
      await User.findByIdAndUpdate(recieverId, { adminChat: true });
    });
  }

  socket.on("send-message", async (data) => {
    const { recieverId } = data;
    const toUser = userSockets.get(recieverId);
    if (toUser) {
      socket.to(toUser).emit("recieve-message", data.text);
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnected");

    for (let [key, value] of userSockets.entries()) {
      if (value == socket.id) {
        userSockets.delete(key);
      }
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server Started on port ${process.env.PORT}`);
});
