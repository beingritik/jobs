const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthenticatedError("Authentication invalid");
    }
    const token = authHeader;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload=",payload)
    req.user = { userId: payload.userID, name: payload.userId };
    console.log("authenticate with = ", req.user.userId);
    next();
  } catch (err) {
    console.log("err=", err.message);
    throw new UnauthenticatedError("Authentication Failed");
  }
};
module.exports = auth ;
