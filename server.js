const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const nomineeRouter = require("./server/API/nominee/nominee..route");
const nominatorRouter = require("./server/API/nominator/nominator.route");
const voteRouter = require("./server/API/vote/vote.route");

const app = express();
const server = http.createServer(app);

// ✅ CORS (FIXED FOR VITE + SOCKET.IO)
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ SOCKET.IO (FIXED)
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("🔥 Socket connected:", socket.id);
});

// ✅ API ROUTES
app.use("/api/nominee", nomineeRouter);
app.use("/api/nominator", nominatorRouter);
app.use("/api/vote", voteRouter);

// ✅ START SERVER
const PORT = 3270;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
