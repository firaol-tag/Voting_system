const voteRouter = require("express").Router();
const { addVote, getVotes, getStatus, toggleStatus } = require("./vote.controller");

voteRouter.post("/", addVote); // add vote
voteRouter.get("/", getVotes); // get vote counts
voteRouter.get("/status", getStatus);
voteRouter.post("/status", toggleStatus);
module.exports = voteRouter;
