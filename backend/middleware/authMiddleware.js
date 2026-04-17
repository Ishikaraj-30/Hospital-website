const jwt = require("jsonwebtoken");

const SECRET_KEY = "jaydev_secret_key";

const verifyToken = (req, res, next) => {
const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.admin = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;