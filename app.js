const express = require("express");
const app = express();

app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// set up server listening
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
