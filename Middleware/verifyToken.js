const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerArray = bearerHeader.split(" ");
    const bearerToken = bearerArray[1];
    // check for token format and verify using jwt.verify
    if (!bearerToken) {
      return res.status(403).json({ message: "Invalid Token Format" });
    }
    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET); // decoded is payload where we store user info
      req.token = bearerToken;
      req.user = decoded.user;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  } else {
    res.status(403).json({ message: "Access denied" });
  }
}

module.exports = verifyToken;
