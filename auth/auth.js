const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("../db/models/user");

const auth = async (req, res, next) => {
  if (req.query.id) {
    const user = await users.findOne({
      _id: req.query.id,
    });
    req.user = user;
    next();
  } else {
    if (!req.cookies.token) {
      req.user = false;
      return next();
    } else {
      try {
        var token = req.cookies.token;
        jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
          if (error) {
            console.log(error);
            req.user = false;
            next();
          } else {
            const user = await users.findOne({
              _id: decoded._id,
              "tokens.token": req.cookies.token,
            });
            if (!user) {
              req.user = false;
              next();
            } else {
              req.user = user;
              req.token = token;
              next();
            }
          }
        });
      } catch (error) {
        console.log("error");
      }
    }
  }
};

module.exports = auth;
