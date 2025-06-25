const joi = require("joi");

exports.userSchema = joi
  .object({
    body: joi.object({
      userName: joi.string().required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi.string().required(),
      token: joi.string(),
      theme: joi.string().required(),
      blocked: joi.boolean().required(),
    }),
  })
  .unknown(true);

exports.loginUserSchema = joi
  .object({
    body: joi.object({
      password: joi.string().required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
    }),
  })
  .unknown(true);

exports.Signout = joi
  .object({
    body: joi.object({
      password: joi.string().required(),
    }),
  })
  .unknown(true);

exports.ChangePass = joi
  .object({
    body: joi.object({
      currentPassword: joi.string().required(),
      newPassword: joi.string().required(),
    }),
  })
  .unknown(true);
