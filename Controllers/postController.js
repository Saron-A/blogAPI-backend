const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  CreatePost,
  getPostsByUserId,
  getPostsByTitleOrContent,
  getPostsByUsername,
} = require("../API/Posts/queries");

const createPostController = async (req, res) => {
  const { title, content, userId } = req.body;
  const newPost = await CreatePost(title, content, userId);
  if (newPost.message === "Post created successfully") {
    res.status(201).json(newPost);
  } else {
    res.status(400).json(newPost);
  }
};

const getPostsByUserIdController = async (req, res) => {
  const { userId } = req.params;
  const posts = await getPostsByUserId(userId);
  res.status(200).json(posts);
};

const getPostsByTitleOrContentController = async (req, res) => {
  const { searchQuery } = req.query;
  const results = await getPostsByTitleOrContent(searchQuery);
  if (results.length > 0) {
    // results is now an array of content
    const filteredResults = results.map((result) => {
      return {
        title: result.title,
        body: result.body,
        author: result.username,
        date: result.createdAt,
      };
    });
  }
};

const getPostsByUsernameController = async (req, res) => {
  const { username } = req.query;
  const posts = await getPostsByUsername(username);
  if (posts.message === "No posts found for this username") {
    res.status(404).json(posts);
  } else {
    // posts is now an array of posts
    //we can filter out only the title and content of the posts and return that to the client
    const filteredPosts = posts.map((post) => {
      return {
        title: post.title,
        body: post.body,
        username: username,
      };
    });
    res.status(200).json(filteredPosts);
  }
};

module.exports = {
  createPostController,
  getPostsByUserIdController,
  getPostsByTitleOrContentController,
  getPostsByUsernameController,
};
