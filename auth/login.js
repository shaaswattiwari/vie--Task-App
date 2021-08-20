const bcrypt = require("bcryptjs");
const users = require("../db/models/user");

async function login(req, res, next) {
  const user = await users.findOne({ email: req.body.email });
  if (!user) {
    console.log("wrong credentials");
    req.user = false;
    req.error = { error: "Kindly check your Email and Password" };
    next();
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    req.user = false;
    req.error = { error: "Kindly check your Email and Password" };
    next();
  }
  req.user = user;
  next();
}

module.exports = login;
