const express = require("express");
const router = express.Router();
const tweet = require("../controllers/tweet.controller");
const { verifyToken } = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadFile");

// Normal routes

// Protected Routes
router.use(verifyToken);
router.get("/", tweet.getAll);
router.post("/", upload.single("image"), tweet.create);
router.post("/:id/reply", upload.single("image"), tweet.create);
router.post("/:id/like", tweet.like);
router.post("/:id/dislike", tweet.unlike);
router.post("/:id/retweet", tweet.retweet);
router.get("/:id", tweet.getOne);
router.delete("/:id", tweet.deleteOne);

module.exports = router;
