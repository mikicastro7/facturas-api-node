const debug = require("debug")("facturas:errores");
const chalk = require("chalk");
const { validationResult } = require("express-validator");

const generaError = (arrayMensajes, status) => {
  const error = new Error(arrayMensajes);
  error.codigo = status;
  return error;
};

const serverError = (err, puerto) => {
  debug(chalk.red.bold("Ha ocurrido un error en el servidor"));
  if (err.code === "EADDRINUSE") {
    debug(chalk.red.bold(`El puerto ${puerto} está ocupado.`));
  }
};

const notFoundError = (req, res, next) => {
  const error = generaError("El endpoint no existe", 404);
  next(error);
};

const generalError = (err, req, res, next) => {
  const error = {
    codigo: err.codigo || 500,
    mensaje: err.codigo ? err.message : "Ha ocurrido un error general"
  };
  res.status(error.codigo).json({ error: true, mensaje: error.mensaje });
};

const badRequestError = req => {
  const errores = validationResult(req);
  let error;
  const mesnsajesErrores = [];
  if (!errores.isEmpty()) {
    const mapaErrores = errores.mapped();
    // eslint-disable-next-line guard-for-in
    for (error in mapaErrores) {
      mesnsajesErrores.push(mapaErrores[error].msg);
    }
    error = generaError("bad request", 400);
    console.log(mesnsajesErrores);
  }
  return error;
};

const idNoExisteError = req => {
  const errores = validationResult(req);
  let error;
  if (!errores.isEmpty()) {
    const mapaErrores = errores.mapped();
    if (mapaErrores.id) {
      error = generaError(mapaErrores.id.msg, 404);
      console.log(mapaErrores);
    }
  }
  return error;
};

module.exports = {
  generaError,
  serverError,
  notFoundError,
  generalError,
  badRequestError,
  idNoExisteError
};
