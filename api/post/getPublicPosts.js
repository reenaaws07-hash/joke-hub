const pool = require("../../db/db");

const getPublicPosts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM posts WHERE visibility = 'public' ORDER BY created_at DESC LIMIT 50`
    );

    return res.status(200).json({ posts: result.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = getPublicPosts;
