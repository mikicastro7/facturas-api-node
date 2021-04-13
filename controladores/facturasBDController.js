const { Op } = require("sequelize");
const { generaError } = require("../utils/errors");
const Factura = require("../db/modelos/facturas");
const facturasParamsQuery = require("../utils/facturasParamsQuery");

const generarObjetoFiltrarQuery = (query) => {
  const objetoQuery = { where: {} };
  if (query.abonadas) {
    if (query.abonadas === "true") {
      objetoQuery.where.abonada = true;
    } else if (query.abonadas === "false") {
      objetoQuery.where.abonada = false;
    }
  }

  if (query.vencidas) {
    if (query.vencidas === "true") {
      objetoQuery.where.vencimiento = { [Op.gt]: new Date().getTime() };
    } else if (query.vencidas === "false") {
      objetoQuery.where.vencimiento = {
        [Op.lt]: new Date().getTime()
      };
    }
  }

  if (query.ordenPor) {
    const campo = query.ordenPor;
    if (query.orden) {
      if (query.orden === "asc" || query.orden === "desc") {
        objetoQuery.order = [[campo, query.orden.toUpperCase()]];
      }
    } else {
      objetoQuery.order = [[campo, "ASC"]];
    }
  }

  if (query.nPorPagina) {
    if (query.pagina) {
      objetoQuery.offset = query.nPorPagina * (query.pagina - 1);
      objetoQuery.limit = query.nPorPagina * query.pagina;
    }
    objetoQuery.limit = +query.nPorPagina;
  }

  if (query.pagina && !query.nPorPagina) {
    const nPorPagina = 5;
    objetoQuery.offset = nPorPagina * (query.pagina - 1);
    objetoQuery.limit = nPorPagina * query.pagina;
  }
  return objetoQuery;
};

const getFacturasBD = async query => {
  const facturas = await Factura.findAll(generarObjetoFiltrarQuery(query));
  const result = {
    error: null,
    facturas: {
      total: facturas.length,
      datos: facturas
    }
  };
  return result;
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
  const objetoQuery = generarObjetoFiltrarQuery(query);
  objetoQuery.where.tipo = tipo;
  const facturas = await Factura.findAll(objetoQuery);
  const result = {
    error: null,
    facturas: {
      total: facturas.length,
      datos: facturas
    }
  };
  return result;
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
