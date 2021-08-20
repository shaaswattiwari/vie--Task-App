const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, lowercase: true },
  description: { type: String, default: "No info" },
  completed: { type: Boolean, default: false },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
});
const tasks = mongoose.model("tasks", taskSchema);

module.exports = tasks;
