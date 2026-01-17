const voteRouter = require("express").Router();
const { addVote, getVotes } = require("./vote.controller");

voteRouter.post("/", addVote); // add vote
voteRouter.get("/", getVotes); // get vote counts

module.exports = voteRouter;
