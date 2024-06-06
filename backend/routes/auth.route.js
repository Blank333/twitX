const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/verifyToken");

// Normal routes
router.post("/register", user.register);
router.post("/login", user.login);

// Check the jwt token of the user
router.get("/", verifyToken, user.authenticate);

module.exports = router;
