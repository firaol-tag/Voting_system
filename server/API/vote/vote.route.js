const voteRouter = require("express").Router();
const auth = require("../../middleware/auth");
const { addVote, getVotes, getStatus, toggleStatus, getVoteByDeviceId } = require("./vote.controller");

voteRouter.post("/", addVote); // add vote
voteRouter.get("/", getVotes); // get vote counts
voteRouter.get("/status", getStatus);
voteRouter.post("/status", toggleStatus);
voteRouter.get("/device/:deviceId", getVoteByDeviceId);
module.exports = voteRouter;
