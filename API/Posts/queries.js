const pool = require("../../models/pool");

//post related queries
//POST /posts - create a new post
//GET /posts - get all posts
//GET /posts/:id - get a post by id
//GET /posts/user/:userId - get all posts by a user id
//GET /posts/search?query= - search posts by title or content
//PUT /posts/:id - update a post by id
//DELETE /posts/:id - delete a post by id

const CreatePost = async (title, content, userId) => {
  try {
    // check for duplicate posts -- check if title is unique for the user
    // create a new post and store in database
    const { rows } = await pool.query(
      "SELECT * from posts WHERE title = $1 AND user_id =$2",
      [title, userId],
    );
    if (rows.length > 0) {
      return {
        message:
          "Post with the same title already exists, please choose another title",
      };
    } else {
      await pool.query(
        "INSERT INTO posts(title, content, userId) VALUES ($1, $2, $3)",
        [title, content, userId],
      );
      return (newPost = {
        message: "Post created successfully",
        post: { title, content, userId },
      });
    }
  } catch (err) {
    console.log(err.message("Error creating post"));
  }
};

const getPostsByUserId = async (userId) => {
  try {
    const { rows } = await pool.query(
      "SELECT posts.* , users.username FROM posts JOIN users ON posts.userId = users.id WHERE user_id = $1",
      [userId],
    );
    return rows;
  } catch (err) {
    console.log(err.message("Error getting posts by user id"));
  }
};

//get posts by title or content
const getPostsByTitleOrContent = async (searchQuery) => {
  try {
    // const { searchQuery } = req.query;
    const { rows } = await pool.query(
      "SELECT posts.*, users.username FROM posts  JOIN users ON posts.userId = users.id       WHERE posts.title ILIKE $1 OR posts.body ILIKE $1"[
        `%${searchQuery}`
      ],
    );
    return rows;
  } catch (err) {
    console.log(err.message("Error getting posts by title or content"));
  }
};

const getPostsByUsername = async (username) => {
  try {
    const { rows } = await pool.query(
      "SELECT posts.* , users.username FROM posts JOIN users ON posts.userId = users.id WHERE users.username = $1,"[
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

module.exports = {
  CreatePost,
  getPostsByUserId,
  getPostsByTitleOrContent,
  getPostsByUsername,
};
