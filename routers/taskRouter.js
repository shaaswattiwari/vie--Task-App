const express = require("express");
const taskRouter = express.Router();
const tasks = require("../db/models/task");
const users = require("../db/models/user");
const multer = require("multer");

var upload = multer({});

taskRouter.get("/task:id", async (req, res) => {
  try {
    var user = await users.findById(req.params.id);
    var userTasks = await user.populate("tasks").execPopulate();

    res.send(userTasks.tasks);
  } catch (err) {
    res.send({ error: err.message });
  }
});

taskRouter.post("/task", async (req, res) => {
  try {
    await new tasks(req.body).save();
    var user = await users.findById(req.body.owner);
    var userTasks = await user.populate("tasks").execPopulate();
    res.send(userTasks.tasks);
  } catch (err) {
    res.send({ error: err.message });
  }
});

taskRouter.patch("/task:id", async (req, res) => {
  try {
    var task = await tasks.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    var user = await users.findById(req.body.owner);
    var userTasks = await user.populate("tasks").execPopulate();
    res.send(userTasks.tasks);
  } catch (err) {
    res.send({ error: err.message });
  }
});

taskRouter.delete("/task:id", async (req, res) => {
  try {
    await tasks.findByIdAndDelete(req.params.id);
    var user = await users.findById(req.body.owner);
    var userTasks = await user.populate("tasks").execPopulate();
    res.send(userTasks.tasks);
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = taskRouter;
