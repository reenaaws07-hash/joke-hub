const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { upload } = require("../config");
const createJoke = require("../api/joke/createJoke");
const getJokes = require("../api/joke/getJokes");

router.post("/", authMiddleware, upload.single("file"), createJoke);
router.get("/", authMiddleware, getJokes);

module.exports = router;
