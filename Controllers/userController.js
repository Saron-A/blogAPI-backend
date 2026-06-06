const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  createUser,
  loginUser,
  getUserById,
  getAllUsers,
} = require("../API/Users/queries");

const createUserController = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // check if user already exists
  // check if username is unique
  // check if password and confirm password match
  // hash password and  store in database

  const newUser = await createUser(username, email, hashedPassword);
  if (newUser.message === "User created successfully") {
    jwt.sign(
      { newUser },
      process.env.JWT_SECRET,
      { expiresIn: "48h" },
      (err, token) => {
        if (err) {
          return { message: "Error generating token" };
        }
        return res.json({ token, user: { username, email } });
      },
    );
  } else {
    console.log(newUser.message);
  }
};

const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  const { token } = req.token;
  jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    const userLogin = await loginUser(email, password);
  });
};

const getUserByIdController = async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  if (user) {
    return res.json(user);
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

const getAllUsersController = async (req, res) => {
  const users = await getAllUsers();
  return res.json(users);
};

module.exports = {
  createUserController,
  loginUserController,
  getUserByIdController,
  getAllUsersController,
};
