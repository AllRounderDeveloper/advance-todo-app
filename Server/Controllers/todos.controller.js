const { todos } = require("../Services/Index");

exports.getTodos = async (req, res) => {
  try {
    const { limit, currentpage } = req.query;
    const { token } = req.headers;

    const todosData = await todos.getTodos(token, limit, currentpage);

    res.status(200).json({ ...todosData });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      todos: [],
      bool: false,
      totalTodos: null,
      error: e.message,
    });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const todo = req.body;

    const createTodoStatus = await todos.createTodo(todo);

    res.status(200).json(createTodoStatus);
  } catch (e) {
    console.log(e);
    res.status(200).json({ message: e, bool: false });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.headers;

    const DeleteStatus = await todos.deleteTodo(token, id);

    res.status(200).json(DeleteStatus);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e, bool: false });
  }
};

exports.getTodo = async (req, res) => {
  try {
    const { token } = req.headers;
    const { id } = req.params;

    const UpdateGet = await todos.TodoGet(id, token);

    res.status(200).json(UpdateGet);
  } catch (e) {
    res.status(400).json({ todo: null, bool: false });
  }
};

exports.UpdateTodoPatch = async (req, res) => {
  try {
    const { todo } = req.body;
    const { token } = req.headers;
    const { id } = req.params;

    const UodateStatus = await todos.UpdateTodo(todo, token, id);
    res.status(200).json(UodateStatus);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e, bool: false });
  }
};
