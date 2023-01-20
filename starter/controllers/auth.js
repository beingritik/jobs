const {StatusCodes}= require('http-status-codes');
const bcrypt = require('bcryptjs')
const {BadRequestError,UnauthenticatedError}= require('../errors') 
const User= require('../models/User') ;

const register = async (req, res) => {
  console.log("register starts with email",req.body.email);
  const {password,name,email}= req.body;
//   const salt = await bcrypt.genSalt(10)
//   const hashedPassword = await bcrypt.hash(password,salt)
  const tempUser = {password,name,email};
  try{
const user = await User.create({
  ...tempUser,
});
res.status(StatusCodes.CREATED).json({ user });  }
  catch(err){
    console.log("errr=",err.message)
  }
  
};

const login = async (req, res) => {
  console.log("login");
};

module.exports = {
    login,
    register
}