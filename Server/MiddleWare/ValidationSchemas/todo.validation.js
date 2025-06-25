const joi = require("joi");

exports.TodoSchemaJoi = joi.object({
  body: joi.object({
    sno: joi.number().required(),
    title: joi.string().required(),
    desc: joi.string().required(),
    date: joi.date().required(),
    time: joi.string().required(),
    done: joi.boolean().required(),
    dueDate: joi.string().optional(),
    dueTime: joi.string().optional(),
    token: joi.string().required(),
    lowerTitle: joi.string().required(),
    decodedDesc: joi.string().required(),
    uid: joi.string().required(),
  }),
});

exports.getTodos = joi.object({
  headers: joi
    .object({
      limit: joi.alternatives().try(joi.number(), joi.string()).required(),
      currentpage: joi
        .alternatives()
        .try(joi.number(), joi.string())
        .required(),
    })
    .unknown(false),
  params: joi.optional(),
});

exports.deleteTodo = joi.object({
  headers: joi.object({
    token: joi.string().required(),
  }),
  params: joi.object({
    id: joi.string().required(),
  }),
});

exports.updateTodo = joi.object({
  headers: joi.object({
    token: joi.string().required(),
  }),
  params: joi.object({
    id: joi.string().required(),
  }),
  body: joi.object({
    todo: joi.object().required(),
  }),
});
