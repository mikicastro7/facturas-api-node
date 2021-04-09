const { generaError } = require("../utils/errors");
let facturasJSON = require("../facturas.json").facturas;
const facturasParamsQuery = require("../utils/facturasParamsQuery");

const getFacturas = (query) => facturasParamsQuery(query, facturasJSON);

const getFactura = id => {
  const factura = facturasJSON.find(factura => factura.id === id);
  const respuesta = {
    factura: null,
    error: null
  };
  respuesta.factura = factura;
  return respuesta;
};

const getFacturasTipo = (tipo, query) => facturasParamsQuery(query, facturasJSON.filter(factura => factura.tipo === tipo));

const crearFactura = (facturaNueva) => {
  const respuesta = {
    factura: null,
    error: null
  };
  if (facturasJSON.find(factura => factura.numero === facturaNueva.numero)) {
    const error = generaError(`Ya existe el la factura con numero ${facturaNueva.numero}`, 409);
    respuesta.error = error;
  }
  if (!respuesta.error) {
    facturaNueva.id = facturasJSON[facturasJSON.length - 1].id + 1;
    facturasJSON.push(facturaNueva);
    respuesta.factura = facturaNueva;
  }
  return respuesta;
};

const sustituirFactura = (idFactura, facturaModificada) => {
  const factura = facturasJSON.find(factura => factura.id === idFactura);
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {
    facturaModificada.id = factura.id;
    facturasJSON[facturasJSON.indexOf(factura)] = facturaModificada;
    respuesta.factura = facturaModificada;
  } else {
    const { error, factura } = crearFactura(facturaModificada);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.factura = factura;
    }
  }
  return respuesta;
};

const modificarFactura = (idFactura, cambios) => {
  const factura = facturasJSON.find(factura => factura.id === idFactura);
  const respuesta = {
    factura: null,
    error: null
  };
  const facturaModificada = {
    ...factura,
    ...cambios
  };
  facturasJSON[facturasJSON.indexOf(factura)] = facturaModificada;
  respuesta.factura = facturaModificada;
  return respuesta;
};

const borrarFactura = idFactura => {
  const factura = facturasJSON.find(factura => factura.id === idFactura);
  const respuesta = {
    factura: null,
    error: null
  };
  facturasJSON = facturasJSON.filter(factura => factura.id !== idFactura);
  respuesta.factura = factura;
  return respuesta;
};

module.exports = {
  getFacturas,
  getFactura,
  getFacturasTipo,
  crearFactura,
  sustituirFactura,
  modificarFactura,
  borrarFactura
};
