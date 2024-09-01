const jwt = require("jsonwebtoken");
const applicationModel = require("../models/applicationModel");
const jobPostingModel = require("../models/jobPostingModel");
const chatModel = require("../models/chatModel");
const { application } = require("express");
const jobSeekerModel = require("../models/jobSeekerModel");
const employerModel = require("../models/employerModel");

const verifyWSToken = (socket, next) => {
  // postman
  // console.log("Handshake data:", socket.handshake.headers.authorization);
  // const authHeader = socket.handshake.headers.authorization;

  // console.log(socket.handshake.auth.token);
  const authHeader =
    socket.handshake.auth.token || socket.handshake.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error("Access denied. No token provided."));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new Error("Access denied. No token provided."));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("errs", err.message);
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.user = decoded;

    console.log("token check done");

    next();
  });
};

module.exports = { verifyWSToken };
