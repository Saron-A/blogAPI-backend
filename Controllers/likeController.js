const { likePost } = require("../API/Likes/queries");
const pool = require("../models/pool");

const likePostController = async (req, res) => {
  const { postId } = req.params; // because it is not sent in the body of the request but in the url
  const user_id = req.user.id;
  try {
    const like = await likePost(user_id, postId);

    if (!like) {
      return res.status(500).json({ message: "Unable to like post." });
    }
    return res.json(like); // should return id, user_id and post_id
    // should return the updated post object with the liked status
  } catch (err) {
    console.error("Error liking post", err.message);
  }
};

module.exports = { likePostController };
