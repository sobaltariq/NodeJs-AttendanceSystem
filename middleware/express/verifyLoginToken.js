const jwt = require("jsonwebtoken");
const {
  NO_TOKEN_PROVIDED,
  INVALID_TOKEN,
} = require("../../utils/errorMessages");

const verifyLoginToken = async (req, res, next) => {
  // const token = req.headers["authorization"]?.split(" ")[1];
  // Check Authorization header
  const tokenFromHeader = req.headers["authorization"]?.split(" ")[1];
  // Check cookies
  const tokenFromCookie = req.cookies["token"];

  // Prefer token from header if both are present
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res.status(401).json({
      error: NO_TOKEN_PROVIDED,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      error: INVALID_TOKEN,
    });
  }
};

module.exports = { verifyLoginToken };
