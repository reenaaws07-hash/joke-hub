const pool = require("../../db/db");

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;

    const room = await pool.query("SELECT * FROM rooms WHERE id = $1", [roomId]);
    if (room.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    await pool.query(
      `INSERT INTO room_members (room_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [roomId, userId]
    );

    return res.status(200).json({ message: "Joined room successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = joinRoom;
