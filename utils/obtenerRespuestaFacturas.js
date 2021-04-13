const fuente = "BD";

const obtenerRespuesta = async (funcionControlador, funcionControladorBD, req, res, next, ...args) => {
  if (fuente === "JSON") {
    const { facturas, error } = funcionControlador(...args);
    if (error) {
      next(error);
    } else {
      res.json(facturas);
    }
  } else if (fuente === "BD") {
    const { factura, facturas, error } = await funcionControladorBD(...args);
    if (error) {
      next(error);
    } else if (facturas) {
      res.json(facturas);
    } else {
      res.json(factura);
    }
  }
};

module.exports = obtenerRespuesta;
