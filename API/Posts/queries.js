const pool = require("../../models/pool");

//post related queries
//POST /posts - create a new post
//GET /posts - get all posts
//GET /posts/:id - get a post by id
//GET /posts/user/:user_id - get all posts by a user id
//GET /posts/search?query= - search posts by title or body
//PUT /posts/:id - update a post by id
//DELETE /posts/:id - delete a post by id

const CreatePost = async (title, body, user_id) => {
  try {
    // check for duplicate posts -- check if title is unique for the user
    // create a new post and store in database
    const { rows } = await pool.query(
      "SELECT * from posts WHERE title = $1 AND user_id =$2",
      [title, user_id],
    );
    if (rows.length > 0) {
      return {
        message:
          "Post with the same title already exists, please choose another title",
      };
    } else {
      await pool.query(
        "INSERT INTO posts(title, body, user_id) VALUES ($1, $2, $3)",
        [title, body, user_id],
      );
      return (newPost = {
        message: "Post created successfully",
        post: { title, body, user_id },
      });
    }
  } catch (err) {
    console.log("Error creating post:", err.message);
  }
};

const getAllPosts = async () => {
  try {
    // need to include author's username as well for integrity
    const { rows: allPosts } = await pool.query(
      "SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.is_published = 'true'",
    );
    return allPosts;
  } catch (err) {
    console.error(err);
    return []; // fallback array so it won't return undefined
  }
};

const getPostsByUserId = async (user_id) => {
  try {
    const { rows } = await pool.query(
      `SELECT posts.* , users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.user_id = $1`,
      [user_id],
    );
    return rows;
  } catch (err) {
    console.error(err, { message: "Error getting posts by user id" });
    return []; //fallback data
  }
};

//get posts by title or body
const getPostsByTitleOrBody = async (searchQuery) => {
  try {
    // const { searchQuery } = req.query;
    const { rows } = await pool.query(
      "SELECT posts.*, users.username FROM posts  JOIN users ON posts.user_id = users.id       WHERE posts.title ILIKE $1 OR posts.body ILIKE $1"[
        `%${searchQuery}`
      ],
    );
    return rows;
  } catch (err) {
    console.log(err.message("Error getting posts by title or body"));
  }
};

const getPostsByUsername = async (username) => {
  try {
    const { rows } = await pool.query(
      "SELECT posts.* , users.username FROM posts JOIN users ON posts.user_id = users.id WHERE users.username = $1,"[
        username
      ],
    );
    if (rows.length === 0) {
      return { message: "No posts found for this username" };
    } else {
      return rows;
    }
  } catch (err) {
    console.log(err.message("Error getting posts by username"));
  }
};

const publishPost = async (post_id) => {
  try {
    await pool.query(
      "UPDATE posts SET is_published = true WHERE posts.id = $1",
      [post_id],
    );
    return { message: "Post Published" };
  } catch (err) {
    console.error("Failed to publish post", err.message);
    return { message: "Failed to publish post" };
  }
};

module.exports = {
  CreatePost,
  getAllPosts,
  getPostsByUserId,
  getPostsByTitleOrBody,
  getPostsByUsername,
  publishPost,
};
