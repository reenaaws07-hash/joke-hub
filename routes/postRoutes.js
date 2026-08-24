const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const createPost = require("../api/post/createPost");
const toggleVisibility = require("../api/post/toggleVisibility");
const getPublicPosts = require("../api/post/getPublicPosts");

router.get("/public", getPublicPosts);                          // no auth needed
router.post("/", authMiddleware, createPost);
router.patch("/:postId/visibility", authMiddleware, toggleVisibility);

module.exports = router;
