const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

require("../db/mongoose");

const PORT = process.env.PORT;
const app = express();

const userRouter = require("../routers/userRouter");
const taskRouter = require("../routers/taskRouter");
const directory = path.join(__dirname, "../public");
const viewsDir = path.join(__dirname, "../templates/views");
const partialDir = path.join(__dirname, "../templates/partial");

app.set("view engine", "hbs");
app.set("views", viewsDir);

app.use(express.static(directory));
app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log("ON at", PORT);
});
