const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  sno: Number,
  title: String,
  desc: String,
  date: String,
  time: String,
  done: Boolean,
  dueDate: String,
  dueTime: String,
  token: String,
  lowerTitle: String,
  decodedDesc: String,
  uid: String,
});

const TodoModel = new mongoose.model("todos", TodoSchema);

module.exports = { TodoModel };
