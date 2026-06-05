const pool = require("../../models/pool");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../../Middleware/verifyToken");
// user related queries

//POST /users/signup -create a new user
//POST /users/login - login a user and return a JWT token
//GET /users - get all users
//GET /users/:id - get a user by id
//PUT /users/:id - update a user by id
//DELETE /users/:id - delete a user by id

const createUser = async (username, email, password, confirmPassword) => {
  try {
    // check if user already exists
    // check if username is unique
    // check if password and confirm password match
    // hash password and  store in database

    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length > 0) {
      return { message: "User already exists" };
    } else if (rows[0].username === username) {
      return { message: "Username already exists, please choose another one" };
    } else if (password !== confirmPassword) {
      return { message: "Passwords do not match" };
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
        [username, email, hashedPassword],
      );
      const user = {
        username: username,
        email: email,
        password: hashedPassword,
      };
      jwt.sign(
        { user },
        process.env.JWT_SECRET,
        { expiresIn: "48h" },
        (err, token) => {
          if (err) {
            return { message: "Error generating token" };
          }
          return { token, user: { username, email } };
        },
      );
      return { message: "User created successfully" };
    }
  } catch (error) {
    return { message: "Server error, failed to create user" };
  }
};

const loginUser = async (email, password) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (rows.length === 0) {
      return { message: "User not found" };
    } else {
      const isMatch = await bcrypt.compare(password, rows[0].password);
      if (!isMatch) {
        return { message: "Invalid credentials" };
      }
      const user = rows[0];
      return (user = {
        username: user.username,
        email: user.email,
        id: user.id,
      });
    }
  } catch (error) {
    return { message: "Server error, failed to login user" };
  }
};

const getUserById = async (id) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return { message: "User not found." };
    }
    const user = {
      id: rows[0].id,
      username: rows[0].username,
      email: rows[0].email,
    };
    return user;
  } catch (err) {
    return { message: "Server error, failed to get user" };
  }
};

const getAllUsers = async () => {
  try {
    const { rows } = await pool.query("SELECT id, username, email FROM users");
    return rows;
  } catch (err) {
    return { message: "Server error, failed to get users" };
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserById,
  getAllUsers,
};
