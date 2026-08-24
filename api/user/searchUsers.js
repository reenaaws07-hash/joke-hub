const pool = require("../../db/db");

const searchUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserId = req.user.userId;

    const result = await pool.query(
      `SELECT id, name, username FROM users
       WHERE id != $1 AND (username ILIKE $2 OR name ILIKE $2)
       ORDER BY username ASC
       LIMIT 20`,
      [currentUserId, `%${search}%`]
    );

    return res.status(200).json({ users: result.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = searchUsers;
