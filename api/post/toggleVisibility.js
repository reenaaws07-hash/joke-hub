const pool = require("../../db/db");

const toggleVisibility = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await pool.query(
      "SELECT * FROM posts WHERE id = $1 AND user_id = $2",
      [postId, userId]
    );

    if (post.rows.length === 0) {
      return res.status(404).json({ message: "Post not found or not yours" });
    }

    const updated = await pool.query(
      "UPDATE posts SET is_public = NOT is_public WHERE id = $1 RETURNING *",
      [postId]
    );

    return res.status(200).json({ post: updated.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = toggleVisibility;
