const express = require("express");
const multer = require("multer");
const auth = require("../auth/auth");
const users = require("../db/models/user");
const login = require("../auth/login");
const sharp = require("sharp");
var url = require("url");

const userRouter = express.Router();
var upload = multer({});

userRouter.get("/", (req, res) => {
  res.redirect("/me");
});

userRouter.get("/login", (req, res) => {
  res.render("login");
});

userRouter.post("/login", upload.single("avatar"), login, async (req, res) => {
  if (req.user === false) {
    res.send(req.error);
  } else {
    const token = await req.user.generateToken();
    var string = "?id=" + req.user._id;
    res.cookie("token", token, { path: "/" });
    res.redirect("/me" + string);
  }
});

userRouter.get("/signup", (req, res) => {
  res.render("signup");
});

userRouter.post("/signup", upload.single("avatar"), async (req, res) => {
  try {
    const buff = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    const user = await new users({
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      password: req.body.password,
      avatar: { mime: "image/png", buff },
    });
    await user.save();
    if (user._id) {
      const token = await user.generateToken();
      var string = "?id=" + user._id;
      res.cookie("token", token, { path: "/" });
      res.redirect("/me" + string);
    }
  } catch (error) {
    if (error.message.includes("duplicate")) {
      res.send({ error: "Email id already exist. Try with a new email." });
    } else {
      res.send({ error: "Request Time-out. Kindly try again." });
    }
  }
});

userRouter.get("/me", auth, (req, res) => {
  if (req.user === false) {
    res.redirect("/login");
  } else {
    var data = { ...req.user };
    data._doc.img = `data:${
      data._doc.avatar.mime
    };base64,${data._doc.avatar.buff.toString("base64")}`;
    delete data._doc.password;
    delete data._doc.avatar;
    res.render("me", data);
  }
});

userRouter.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie("token");
    res.redirect("/login");
  } catch (err) {
    res.send({ error: err.message });
  }
});

userRouter.post("/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.clearCookie("token");
    res.redirect("/login");
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = userRouter;
