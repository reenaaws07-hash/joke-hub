const pool = require("../../db/db");

const getJokes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const type = req.query.type;

    if (type && !["sent", "received"].includes(type)) {
      return res.status(400).json({ message: "type must be 'sent' or 'received'" });
    }

    const sentQuery = `
      SELECT j.*, u.username AS sender_username, u.name AS sender_name
      FROM jokes j
      JOIN users u ON u.id = j.sender_id
      WHERE j.sender_id = $1
      ORDER BY j.created_at DESC
    `;
    const receivedQuery = `
      SELECT j.*, u.username AS sender_username, u.name AS sender_name
      FROM jokes j
      JOIN users u ON u.id = j.sender_id
      WHERE $1 = ANY(j.recipients)
      ORDER BY j.created_at DESC
    `;

    if (type === "sent") {
      const result = await pool.query(sentQuery, [userId]);
      return res.status(200).json({ jokes: result.rows });
    }

    if (type === "received") {
      const result = await pool.query(receivedQuery, [userId]);
      return res.status(200).json({ jokes: result.rows });
    }

    const [sent, received] = await Promise.all([
      pool.query(sentQuery, [userId]),
      pool.query(receivedQuery, [userId]),
    ]);

    return res.status(200).json({ sent: sent.rows, received: received.rows });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = getJokes;
