const { UNAUTHORIZED_ACCESS } = require("../../utils/errorMessages");

const checkAdminRole = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: UNAUTHORIZED_ACCESS });
  }
  next();
};

module.exports = {
  checkAdminRole,
};
