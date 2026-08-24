const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const searchUsers = require("../api/user/searchUsers");

router.get("/", authMiddleware, searchUsers);

module.exports = router;
