const { Op } = require("sequelize");
const { generaError } = require("../utils/errors");
const Factura = require("../db/modelos/facturas");
const facturasParamsQuery = require("../utils/facturasParamsQuery");

const generarObjetoFiltrarQuery = (query) => {
  const objetoQuery = { where: {} };
  if (query.abonadas) {
    objetoQuery.where.abonadas = query.abonadas;
  }
  if (query.vencidas) {
    objetoQuery.where.vencidas = {
      [Op.gt]: new Date().getTime()
    };
  }
  return objetoQuery;
};

const getFacturasBD = async query => {
  console.log(generarObjetoFiltrarQuery(query));

  const facturas = await Factura.findAll();
  return facturasParamsQuery(query, facturas);
};

const getFacturaBD = async id => {
  const respuesta = {
    factura: null,
    error: null
  };
  respuesta.factura = await Factura.findByPk(id);
  return respuesta;
};

const getFacturasTipoBD = async (tipo, query) => {
  const facturas = await Factura.findAll({
    where: {
      tipo
    }
  });
  return facturasParamsQuery(query, facturas);
};

const crearFacturaBD = async nuevaFactura => {
  const respuesta = {
    factura: null,
    error: null
  };
  const facturaEncontrada = await Factura.findOne({
    where: {
      numero: nuevaFactura.numero,
    }
  });
  if (facturaEncontrada) {
    const error = generaError("Ya existe la factura con el mismo numero", 409);
    respuesta.error = error;
  } else {
    const nuevaFacturaBD = await Factura.create(nuevaFactura);
    respuesta.factura = nuevaFacturaBD;
  }
  return respuesta;
};

const sustituirFacturaBD = async (idFactura, facturaModificada) => {
  const facturaEncontrada = await Factura.findByPk(idFactura);
  const respuesta = {
    factura: null,
    error: null
  };
  if (facturaEncontrada) {
    await Factura.update(facturaModificada, {
      where: {
        id: idFactura
      }
    });
    const facturaModificadaDB = await Factura.findByPk(idFactura);
    respuesta.factura = facturaModificadaDB;
  } else {
    const { error, factura } = await crearFacturaBD(facturaModificada);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.factura = factura;
    }
  }
  return respuesta;
};

const modificarFacturaBD = async (idFactura, cambios) => {
  const factura = await Factura.findByPk(idFactura);
  const respuesta = {
    factura: null,
    error: null
  };
  const facturaModificada = {
    ...factura,
    ...cambios
  };
  await Factura.update(facturaModificada, {
    where: {
      id: idFactura
    }
  });
  const facturaModificadaDB = await Factura.findByPk(idFactura);
  respuesta.factura = facturaModificadaDB;
  return respuesta;
};

const borrarFacturaBD = async idFactura => {
  const facturaEncontrada = await Factura.findByPk(idFactura);
  const respuesta = {
    factura: null,
    error: null
  };
  await facturaEncontrada.destroy();
  respuesta.factura = facturaEncontrada;
  return respuesta;
};

module.exports = {
  getFacturasBD,
  getFacturaBD,
  getFacturasTipoBD,
  crearFacturaBD,
  sustituirFacturaBD,
  modificarFacturaBD,
  borrarFacturaBD
};
