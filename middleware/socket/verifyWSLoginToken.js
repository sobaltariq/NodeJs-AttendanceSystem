const jwt = require("jsonwebtoken");
const {
  NO_TOKEN_PROVIDED,
  INVALID_TOKEN,
} = require("../../utils/errorMessages");

const verifyWSLoginToken = (socket, next) => {
  // postman
  console.log("Handshake data:", socket.handshake);
  const authHeader = socket.handshake.headers.authorization;

  // console.log(socket.handshake.auth.token);
  // const authHeader = socket.handshake.auth.token || socket.handshake.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error(NO_TOKEN_PROVIDED));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new Error(NO_TOKEN_PROVIDED));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("errs", err.message);
      return next(new Error(INVALID_TOKEN));
    }
    socket.user = decoded;

    console.log("token check done");

    next();
  });
};

module.exports = { verifyWSLoginToken };
