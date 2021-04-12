const { validationResult } = require("express-validator");

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
const idInexistente = req => {
  const errores = validationResult(req);
  let error;
  if (!errores.isEmpty()) {
    const mapaErrores = errores.mapped();
    if (mapaErrores.id) {
      error = generaError(mapaErrores.id.msg, 404);
    }
  }
  return error;
};
const errorBadRequest = req => {
  const errores = validationResult(req);
  let error;
  if (!errores.isEmpty()) {
    const mapaErrores = errores.mapped();
    error = generaError("La factura no tiene la forma correcta", 400);
    console.log(mapaErrores);
  }
  return error;
};

module.exports = {
  errorBadRequest,
  idInexistente,
  generaError,
  errorNotFound,
  errorGeneral
};
