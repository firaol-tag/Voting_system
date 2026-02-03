const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const nomineeRouter = require("./server/API/nominee/nominee..route");
const voteRouter = require("./server/API/vote/vote.route");
const app = express();
const server = http.createServer(app);
app.use(cookieParser());
app.use(
  cors({
    origin: "http://192.168.101.181:5173", // Vite frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const { Server } = require("socket.io");
const authRouter = require("./server/API/auth/auth.route");
const io = new Server(server, {
  cors: {
    origin: "http://192.168.101.181:5173",
    methods: ["GET", "POST"],
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("🔥 Socket connected:", socket.id);
});
app.use("/",nomineeRouter)
app.use("/api/nominee", nomineeRouter);
app.use("/api/vote", voteRouter);
app.use("/api/user", authRouter);
const PORT = 3270;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at port: ${PORT}`);
});
