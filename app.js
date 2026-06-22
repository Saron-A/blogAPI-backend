require("dotenv").config();
const express = require("express");
const pool = require("./models/pool");
const verifyToken = require("./Middleware/verifyToken");
const jwt = require("jsonwebtoken");
const path = require("node:path");
const cors = require("cors");

const {
  createUserController,
  loginUserController,
  getUserByIdController,
  getAllUsersController,
} = require("./Controllers/userController");

const {
  createPostController,
  getPostsByUserIdController,
  getPostsByTitleOrContentController,
  getPostsByUsernameController,
  publishPostController,
} = require("./Controllers/postController");

const {
  CreatePost,
  getAllPosts,
  getPostsByUserId,
  getPostById,
  getPostsByTitleOrBody,
  getPostsByUsername,
} = require("./API/Posts/queries");

const {
  createUser,
  loginUser,
  getUserById,
  getAllUsers,
} = require("./API/Users/queries");

const { likePostController } = require("./Controllers/likeController");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ROUTES
* Landing page
* Signup - get form and post information
* Login - get form and post credential
* Dashboard - after login
            - profile, posts - published & unpublished
            - Add post - publish
            - Search posts, users
* Logout
*/
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// app.get("/api/signup", (req, res) => {
//   return req.render("signupForm");
// });

app.post("/api/signup", createUserController);

// app.get("/api/login", (req, res) => {
//   return req.render("loginForm");
// });

app.post("/api/login", loginUserController);

app.get("/api/dashboardA", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
      if (err) {
        return res.sendStatus(403);
      }
      // not from req.params but from the authData because data is stored in the authData
      const userId = authData.user.id;
      const posts = await getPostsByUserId(userId);
      console.log(posts);
      const userInfo = await getUserById(userId);

      // const filteredUserInfo = userInfo.map((info) => {
      //   return {
      //     id: info.id,
      //     username: info.username,
      //     email: info.email,
      //   };
      // }); - because only one user is present so we don't need to use map() function

      const filteredUserInfo = {
        username: userInfo.username,
        email: userInfo.email,
      };

      const filteredPostsInfo = (posts || []).map((post) => ({
        id: post.id,
        title: post.title,
        body: post.body,
        time: post.created_at,
        is_published: post.is_published,
        author: post.username,
        like_id: post.like_id,
      }));

      return res.json(
        (allInfo = {
          posts: filteredPostsInfo,
          user: filteredUserInfo,
        }),
      );
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Dashboard error." });
  }
});

app.get("/api/dashboardV", verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
      if (err) {
        return res.status(403);
      }
      const user = {
        username: authData.user.username,
        email: authData.user.email,
      };
      const myPosts = await getAllPosts(); // return array of published posts
      const filteredPosts = myPosts.map((myPost) => ({
        id: myPost.id,
        title: myPost.title,
        body: myPost.body,
        time: myPost.created_at,
        author: myPost.username,
      }));
      return res.json({ posts: filteredPosts, user: user });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Dashboard Error." });
  }
});

app.get("/api/profile", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      return res
        .status(403)
        .send({ message: "Please login to view your profile." });
    }
    const id = authData.user.id;
    const userInfo = await getUserById(id);
    const filteredUserInfo = {
      username: userInfo.username,
      email: userInfo.email,
    };

    return res.json(filteredUserInfo);
  });
});

app.get("/api/posts", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Please login to view your posts." });
    }
    const id = authData.user.id;
    const userPosts = await getPostsByUserId(id);
    // returns array of posts
    const filteredPosts = userPosts.map((userPost) => ({
      id: userPost.id,
      title: userPost.title,
      author: userPost.username,
      time: userPost.created_at,
      is_published: userPost.is_published,
      body: userPost.body,
    }));

    return res.json(filteredPosts);
  });
});

app.post("/api/posts", verifyToken, createPostController);

//get post by id and edit info
app.put("/api/posts/:postId/publish", verifyToken, publishPostController);

app.get("/api/posts/:postId", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.status(403);
    }

    const { postId } = req.params;
    const post = await getPostById(postId); // gets an object
    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }

    const user = {
      username: authData.user.username,
      email: authData.user.email,
    };
    return res.status(200).json({ post, user });
  });
});

app.post("/api/posts/:postId/like", verifyToken, likePostController);

app.post("/api/logout", (req, res) => {});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const accessPath = path.join(__dirname, "Public");
app.use(express.static(accessPath));

// set up server listening
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
