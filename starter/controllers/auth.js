const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");

const register = async (req, res) => {
  console.log("register starts with email", req.body.email);
  try {
    const user = await User.create({
      ...req.body,
    });
    const token = await user.createJWT();
    // console.log("token=",token)
    res.status(StatusCodes.CREATED).json({ user, token: token });
  } catch (err) {
    console.log("errr=", err.message);
  }
};

const login = async (req, res) => {
  // console.log("login starts with email", req.body.email);
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new BadRequestError("please provide valid info");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    const isPasswordMatched = await user.comparePassword(password);
        // console.log("passsss=", isPassowrdMatched);
    if (!isPasswordMatched) {
      throw new UnauthenticatedError("Invalid Credentials"); 
    }
    const token = await user.createJWT();
    res
      .status(StatusCodes.OK)
      .json({ user: { name: user.name }, token: token });
  }
  catch (err) {
    console.log("error is=", err.message);
  }
};

module.exports = {
  login,
  register,
};
