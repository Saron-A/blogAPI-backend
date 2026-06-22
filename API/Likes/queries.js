const pool = require("../../models/pool");

// write queries related to like

const likePost = async (user_id, post_id) => {
  const { rows } = await pool.query(
    `INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING *`,
    [user_id, post_id],
  );
  return rows[0];
};

module.exports = { likePost };
