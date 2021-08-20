const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const tasks = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is requiredd"],
    },
    age: {
      type: Number,
      required: true,
      validate(value) {
        if (value < 18) {
          throw new Error("Age is less than 18");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email is already in use"],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password should be more than 6 characters"],
    },
    avatar: { mime: { type: String }, buff: { type: Buffer } },
    tokens: [{ token: { type: String, required: true } }],
  },
  { timestamps: true }
);

userSchema.virtual("tasks", {
  ref: "tasks",
  localField: "_id",
  foreignField: "owner",
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

const users = new mongoose.model("users", userSchema);

module.exports = users;
