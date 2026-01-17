const express = require("express");
const cors = require("cors");
require("dotenv").config();

const nomineeRouter = require("./server/API/nominee/nominee..route");
const nominatorRouter = require("./server/API/nominator/nominator.route");
const voteRouter = require("./server/API/vote/vote.route");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/nominee", nomineeRouter);
app.use("/api/nominator", nominatorRouter);
app.use("/api/vote", voteRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
