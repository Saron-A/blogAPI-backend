const pool = require("../../models/pool");

// write queries related to like

const likePost = async (user_id, post_id) => {
  await pool.query("INSERT INTO likes (user_id, post_id) VALUES ($1, $2)", [
    user_id,
    post_id,
  ]);
  // should update the like_id in the posts table
  const { rows } = await pool.query(
    "SELECT * FROM likes WHERE user_id = $1 AND post_id=$2",
    [user_id, post_id],
  );
  const like = rows[0];
  return like;
};

module.exports = { likePost };
