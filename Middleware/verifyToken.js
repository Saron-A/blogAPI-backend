function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerArray = bearerHeader.split(" ");
    const bearerToken = bearerArray[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
}

module.exports = verifyToken;
