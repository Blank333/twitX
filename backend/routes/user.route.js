const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controller");
const tweet = require("../controllers/tweet.controller");

const { verifyToken } = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadFile");

// Normal routes
router.get("/:username", user.getOne);
router.get("/:username/tweets", tweet.getAll);
router.get("/", user.getAll);

// Protected Routes
router.use(verifyToken);
router.post("/:id/follow", user.follow);
router.post("/:id/unfollow", user.unfollow);
router.put("/:id", user.updateOne);
router.post("/:id/uploadProfilePic", upload.single("image"), user.uploadImage);

module.exports = router;
