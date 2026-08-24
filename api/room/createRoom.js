const pool = require("../../db/db");

const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO rooms (name, created_by) VALUES ($1, $2) RETURNING *`,
      [name, userId]
    );

    // auto-add creator as member
    await pool.query(
      `INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)`,
      [result.rows[0].id, userId]
    );

    return res.status(201).json({ room: result.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = createRoom;
