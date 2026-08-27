const { put } = require("@vercel/blob");
const pool = require("../../db/db");

const createJoke = async (req, res) => {
  try {
    const { text } = req.body;
    const senderId = req.user.userId;

    let recipients = req.body.recipients;
    if (typeof recipients === "string") {
      try {
        const parsed = JSON.parse(recipients);
        recipients = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        recipients = recipients.split(",").map((r) => r.trim());
      }
    }
    recipients = (recipients || []).map(Number).filter((r) => !Number.isNaN(r));

    if (!text && !req.file) {
      return res.status(400).json({ message: "Joke must have text or a file" });
    }
    if (text && text.length > 500) {
      return res.status(400).json({ message: "Text must be 500 characters or fewer" });
    }
    if (recipients.length === 0) {
      return res.status(400).json({ message: "At least one recipient is required" });
    }

    let fileUrl = null;
    let fileType = null;
    if (req.file) {
      const blob = await put(`jokes/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
        access: "public",
        contentType: req.file.mimetype,
      });
      fileUrl = blob.url;
      fileType = req.file.mimetype;
    }

    const result = await pool.query(
      `INSERT INTO jokes (sender_id, recipients, text, file_url, file_type) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [senderId, recipients, text ?? null, fileUrl, fileType]
    );

    return res.status(201).json({ joke: result.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = createJoke;
