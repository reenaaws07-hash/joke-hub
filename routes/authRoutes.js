const express = require("express");

const router = express.Router();

const login = require("../api/auth/login");
const signup = require("../api/auth/signup");

router.post("/login", login);
router.post("/signup", signup);

// router.post("/signup", async (req, res) => {
//     res.json({
//       message: "Signup route working"
//     });
//   });

module.exports = router;