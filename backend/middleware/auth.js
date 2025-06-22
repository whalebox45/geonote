const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // req.user.userId 可用於 Memory 建立
    next();
  } catch (err) {
    res.sendStatus(403);
  }
}

module.exports = authenticateJWT;
