const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error.array()[0]);

    return res.status(400).json({ error: error.array()[0] });
  }
  next();
};

module.exports = validateRequest;
