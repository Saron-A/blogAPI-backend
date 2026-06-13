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

  const newUser = await createUser(username, email, password, confirmPassword);
  if (newUser.message === "User created successfully") {
    return res.json((user = { username, email }));
  } else {
    console.log(newUser.message);
    return res.status(400).json({ message: newUser.message });
  }
};

const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  const userLogin = await loginUser(email, password);
  if (userLogin.message === "User logged in successfully") {
    const user = {
      username: userLogin.username,
      email: userLogin.email,
      id: userLogin.id,
    };

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "48h",
    });
    return res.json((data = { token, user }));
  } else {
    return res.status(400).json({ message: "Wrong Credentials" });
  }
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
