const pool = require("../../db/db");

const createPost = async (req, res) => {
  try {
    const { content, is_public, room_id } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO posts (user_id, content, is_public, room_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, content, is_public ?? false, room_id ?? null]
    );

    return res.status(201).json({ post: result.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = createPost;
