const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const createRoom = require("../api/room/createRoom");
const joinRoom = require("../api/room/joinRoom");

router.post("/", authMiddleware, createRoom);
router.post("/:roomId/join", authMiddleware, joinRoom);

module.exports = router;
