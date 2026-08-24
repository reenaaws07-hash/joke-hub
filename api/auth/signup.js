const bcrypt = require("bcrypt");
const pool = require("../../db/db");

const signup = async (req, res) => {
  try {
    const { name, email, username, password, confirm } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (confirm !== undefined && confirm !== password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await pool.query(
      "SELECT email, username FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      const taken = existingUser.rows[0].email === email ? "Email" : "Username";
      return res.status(400).json({ message: `${taken} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users(name, email, username, password) VALUES($1, $2, $3, $4) RETURNING id, name, email, username`,
      [name, email, username, hashedPassword]
    );

    return res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = signup;
