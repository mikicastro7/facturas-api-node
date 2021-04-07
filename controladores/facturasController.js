const { generaError } = require("../utils/errors");
const facturasJSON = require("../facturas.json").facturas;

const getFacturas = () => ({
  total: facturasJSON.length,
  datos: facturasJSON
});

const getFactura = id => {
  const factura = facturasJSON.find(factura => factura.id === id);
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {
    respuesta.factura = factura;
  } else {
    const error = generaError("La factura no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};

const getFacturasTipo = (tipo) => {
  const facturas = facturasJSON.filter(factura => factura.tipo === tipo);
  return {
    total: facturas.length,
    datos: facturas
  };
};

const crearFactura = (facturaNueva) => {
  const respuesta = {
    factura: null,
    error: null
  };
  if (facturasJSON.find(factura => factura.numero === facturaNueva.numero)) {
    const error = generaError(`Ya existe el la factura con numero${facturaNueva.numero}`, 409);
    respuesta.error = error;
  }
  if (!respuesta.error) {
    facturaNueva.id = facturasJSON[facturasJSON.length - 1].id + 1;
    facturasJSON.push(facturaNueva);
    respuesta.factura = facturaNueva;
  }
  return respuesta;
};

module.exports = {
  getFacturas,
  getFactura,
  getFacturasTipo,
  crearFactura
};
