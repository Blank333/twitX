const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const tweetSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tweetedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: [ObjectId],
      ref: "User",
    },
    retweetBy: {
      type: [ObjectId],
      ref: "User",
    },
    imageURL: {
      type: String,
    },
    replies: {
      type: [ObjectId],
      ref: "Tweet",
    },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
