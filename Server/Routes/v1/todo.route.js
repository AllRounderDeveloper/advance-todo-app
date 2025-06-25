const router = require("express").Router();
const { Todos } = require("../../Controllers/Index");
const validator = require("../../MiddleWare/validation");
const { getTodos, TodoSchemaJoi, deleteTodo, updateTodo } =
  require("../../MiddleWare/ValidationSchemas/Index").TodosValidation;

router
  .route("/")
  .get(validator(getTodos), Todos.getTodos)
  .post(validator(TodoSchemaJoi), Todos.createTodo);

router
  .route("/:id")
  .delete(validator(deleteTodo), Todos.deleteTodo)
  .get(Todos.getTodo)
  .patch(validator(updateTodo), Todos.UpdateTodoPatch);

module.exports = router;
