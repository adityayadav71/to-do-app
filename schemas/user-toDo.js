const mongoose = require("mongoose");

const userToDoSchema = mongoose.Schema({
  username: String,
  toDo: String,
});

module.exports = mongoose.model("todos", userToDoSchema);
