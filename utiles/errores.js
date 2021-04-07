const generaError = (msg, status) => {
  const error = new Error(msg);
  error.codigo = status;
  return error;
};

const sendErrores = (err, req, res, next) => {
  const error = {
    codigo: err.codigo || 500,
    mensaje: err.codigo ? err.message : "Ha ocurrido un error general"
  };
  res.status(error.codigo).json({ error: true, mensaje: error.mensaje });
};

const errorNotFound = (req, res, next) => {
  const error = generaError("El endpoint no existe", 404);
  next(error);
};

module.exports = {
  generaError,
  errorNotFound,
  sendErrores
};
