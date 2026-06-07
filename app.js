require("dotenv").config();
const express = require("express");
const pool = require("./models/pool");
const verifyToken = require("./Middleware/verifyToken");
const jwt = require("jsonwebtoken");
const path = require("node:path");

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
} = require("./Controllers/postController");

const {
  CreatePost,
  getPostsByUserId,
  getPostsByTitleOrContent,
  getPostsByUsername,
} = require("./API/Posts/queries");

const {
  createUser,
  loginUser,
  getUserById,
  getAllUsers,
} = require("./API/Users/queries");

const app = express();

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
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// app.get("/api/signup", (req, res) => {
//   return req.render("signupForm");
// });

app.post("/api/signup", createUserController);

// app.get("/api/login", (req, res) => {
//   return req.render("loginForm");
// });

app.post("/api/login", verifyToken, loginUserController);

app.get("/api/dashboard", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const { id } = req.params;
      const posts = getPostsByUserId(id);
      const userInfo = getUserById(id);

      const filteredUserInfo = userInfo.map((info) => {
        return {
          username: info.username,
          email: info.email,
        };
      });

      const filteredPostsInfo = posts.map((post) => {
        return {
          title: post.title,
          body: post.body,
          time: post.createdAt,
          isPublished: post.isPublished,
          author: post.username,
        };
      });

      return res.render("dashboard", {
        posts: filteredPostsInfo,
        user: filteredUserInfo,
      });
    }
  });
});

app.get("/API/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_TOKEN, (err, authData) => {
    if (err) {
      return res
        .statusCode(403)
        .send({ message: "Please login to view your profile." });
    } else {
      const { id } = req.params;
      const user = getUserById(id);
      const filteredUserInfo = user.map((info) => {
        return { username: info.username, email: info.email };
      });

      return res.render("profile", filteredUserInfo);
    }
  });
});

app.post("/api/logout", (req, res) => {});

app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "ejs");

const accessPath = path.join(__dirname, "Public");
app.use(express.static(accessPath));

// set up server listening
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
