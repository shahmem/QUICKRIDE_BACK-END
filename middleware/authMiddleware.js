const jwt = require("jsonwebtoken"); // ✅ Add this line
require("dotenv").config();

const verifyToken = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // skip token verification for preflight
  }

  const authHeader = req.headers.authorization;
  // console.log("Authorization Header:", authHeader);
 
  if (!authHeader)
    return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  // console.log("Extracted Token:", token);

  if (!token)
    return res.status(401).json({ message: "Access token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded JWT:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};


module.exports = verifyToken;

