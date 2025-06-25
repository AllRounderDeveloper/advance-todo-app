require("dotenv").config();
const { Todos } = require("../Models/Index");
const jwt = require("jsonwebtoken");

exports.createTodo = async (todo) => {
  try {
    const newTodo = await Todos.TodoModel.create({ ...todo });
    await newTodo.save();

    return {
      message: "Todo Crreated",
      bool: true,
    };
  } catch (e) {
    throw new Error(e);
  }
};

exports.deleteTodo = async (token, id) => {
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN);
  await Todos.TodoModel.deleteOne({ uid: payload.userId, _id: id });

  return { message: "todo Deleted", bool: true };
};

exports.TodoGet = async (id, token) => {
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN);

  const todo = await Todos.TodoModel.findOne({ uid: payload.userId, _id: id });

  return { todo, bool: true };
};

exports.UpdateTodo = async (todo, token, id) => {
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN);

  await Todos.TodoModel.updateOne(
    { uid: payload.userId, _id: id },
    { $set: { ...todo } }
  );

  return { message: "Updated", bool: true };
};

exports.getTodos = async (token, limit, currentpage) => {
  // Fetching the todos
  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(currentpage);

  const payload = jwt.verify(token, process.env.ACCESS_TOKEN);
  const totalTodos = await Todos.TodoModel.countDocuments({
    uid: payload.userId,
  });

  const firstDocIndex = (parsedPage - 1) * parsedLimit;

  const paginatedTodos = await Todos.TodoModel.find({
    uid: payload.userId,
  })
    .skip(firstDocIndex)
    .limit(parsedLimit);

  // Fetching the highest Sno

  const allsno = [];
  const allDocs = await Todos.TodoModel.find({ uid: payload.userId });

  allDocs.forEach((doc) => allsno.push(doc.sno));

  const highestSno = allsno[allsno.length - 1];

  return {
    todos: paginatedTodos,
    bool: true,
    totalTodos,
    sno: highestSno + 1 || 1,
  };
};
