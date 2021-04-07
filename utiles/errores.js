const generaError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.codigo = status;
  return error;
};

const errorNotFound = (req, res, next) => {
  const error = generaError("El endpoint no existe", 404);
  next(error);
};

const errorGeneral = (err, req, res, next) => {
  const error = {
    codigo: err.codigo || 500,
    mensaje: err.codigo ? err.message : "Ha ocurrido un error general"
  };
  res.status(error.codigo).json({ error: true, mensaje: error.mensaje });
};

module.exports = {
  generaError,
  errorNotFound,
  errorGeneral
};
