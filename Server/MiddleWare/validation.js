module.exports = (schema) => (req, res, next) => {
  const toValidate = {};

  if (schema.body) toValidate.body = req.body;
  if (schema.query) toValidate.query = req.query;
  if (schema.params) toValidate.params = req.params;
  if (schema.headers) toValidate.headers = req.headers;

  const { error, value } = schema.validate(toValidate, { abortEarly: false });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  // Update request objects with validated values
  if (value.query) Object.assign(req.query, value.query);
  if (value.params) Object.assign(req.params, value.params);
  if (value.body) Object.assign(req.body, value.body);
  if (value.headers) Object.assign(req.headers, value.headers);

  next();
};
