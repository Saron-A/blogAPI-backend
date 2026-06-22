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
// update the post related queries to account for likes
const getAllPosts = async (user_id) => {
  try {
    // need to include author's username as well for integrity\
    // edit the query to make sure the like.user_id is same as the current user while the rest match the authors of each post
    const { rows: allPosts } = await pool.query(
      `SELECT DISTINCT ON (posts.id)
  posts.id,
  posts.title,
  posts.body,
  posts.created_at,
  users.username,
  likes.id AS like_id
FROM posts
JOIN users ON posts.user_id = users.id
LEFT JOIN likes 
  ON likes.post_id = posts.id 
  AND likes.user_id = $1
WHERE posts.is_published = true
ORDER BY posts.id, likes.id DESC;`,
      [user_id],
    );
    return allPosts;
  } catch (err) {
    console.error(err);
    return []; // fallback array so it won't return undefined
  }
};

const getPostById = async (user_id, post_id) => {
  try {
    const { rows } = await pool.query(
      `SELECT posts.*,likes.id AS like_id FROM posts
LEFT JOIN likes   ON likes.post_id = posts.id AND likes.user_id = $1 WHERE posts.id = $2`,
      [user_id, post_id],
    );

    return rows[0]; // returns the first row
  } catch (err) {
    console.error("Error fetching post", err.message);
  }
};

const getPostsByUserId = async (user_id) => {
  try {
    // to avoid mixup between posts.id and likes.id
    const { rows } = await pool.query(
      `SELECT posts.* , users.username, likes.id AS like_id FROM posts JOIN users on posts.user_id = users.id LEFT JOIN likes ON likes.user_id = users.id AND likes.post_id = posts.id WHERE posts.user_id = $1`,
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
      "SELECT posts.* , users.username, likes.id FROM posts JOIN users on posts.user_id = users.id LEFT JOIN likes ON likes.user_id = users.id AND likes.post_id = posts.id WHERE posts.title ILIKE $1 OR posts.body ILIKE $1"[
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
      "SELECT posts.* , users.username, likes.id FROM posts JOIN users on posts.user_id = users.id JOIN likes ON likes.user_id = users.id AND likes.post_id = posts.id WHERE users.username = $1,"[
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
  getPostById,
  getPostsByUserId,
  getPostsByTitleOrBody,
  getPostsByUsername,
  publishPost,
};
