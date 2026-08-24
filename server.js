require("dotenv").config();

const path = require("path");
const express = require("express");
const pool = require("./db/db");
const roomRoutes = require("./routes/roomRoutes");
const postRoutes = require("./routes/postRoutes");
const jokeRoutes = require("./routes/jokeRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && origin.startsWith("http://localhost")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (process.env.CORS_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/jokes", jokeRoutes);
app.use("/api/users", userRoutes);

app.get("/health", async (req, res) => {
    // res.send("Hello Express");
  try {
    const result = await pool.query(
      "SELECT * FROM users"
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Database Error",
    });
  }
});


app.listen(process.env.PORT, () => {
  console.log(`server runing ${process.env.PORT}`);
});