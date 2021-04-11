const express = require("express");
const { checkSchema, check } = require("express-validator");
const options = require("../parametrosCLI");

const router = express.Router();
const facturasJSON = require("../facturas.json").facturas;
const { badRequestError } = require("../utils/errors");

const getFacturaShema = require("../dataShemas/facturaSchema");
const {
  getFacturas, getFactura, getFacturasTipo, crearFactura, sustituirFactura, modificarFactura, borrarFactura
} = require("../controladores/facturasController");

const {
  getFacturasBD, getFacturaBD, getFacturasTipoBD, crearFacturaBD, sustituirFacturaBD, modificarFacturaBD, borrarFacturaBD
} = require("../controladores/facturasBDController");

const obtenerRespuesta = require("../utils/obtenerRespuestaFacturas");

const fuente = "BD";

const compruebaId = idFactura => {
  if (fuente === "JSON") {
    return facturasJSON.find(factura => factura.id === +idFactura);
  } else {
    return true;
  }
};

const facturaCompletaSchema = getFacturaShema("completo");
const facturaParcialSchema = getFacturaShema("parcial");

router.get("/", async (req, res, next) => {
  obtenerRespuesta(getFacturas, getFacturasBD, req, res, next, req.query);
});

router.get("/factura/:idFactura",
  check("idFactura", "No existe la factura").custom(compruebaId),
  async (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const idFacura = +req.params.idFactura;
    obtenerRespuesta(getFactura, getFacturaBD, req, res, next, idFacura);
  });

router.get("/ingresos", async (req, res, next) => {
  obtenerRespuesta(getFacturasTipo, getFacturasTipoBD, req, res, next, "ingreso", req.query);
});

router.get("/gastos", async (req, res, next) => {
  obtenerRespuesta(getFacturasTipo, getFacturasTipoBD, req, res, next, "gasto", req.query);
});

router.post("/factura",
  checkSchema(facturaCompletaSchema),
  async (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const nuevaFactura = req.body;
    obtenerRespuesta(crearFactura, crearFacturaBD, req, res, next, nuevaFactura);
  });

router.put("/factura/:idFactura",
  check("idFactura", "No existe la factura").custom(compruebaId),
  checkSchema(facturaCompletaSchema),
  (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const nuevaFactura = req.body;
    const idFactura = req.params.idFactura;
    obtenerRespuesta(sustituirFactura, sustituirFacturaBD, req, res, next, idFactura, nuevaFactura);
  });

router.patch("/factura/:idFactura",
  check("idFactura", "No existe la factura").custom(compruebaId),
  checkSchema(facturaParcialSchema),
  (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const idFactura = +req.params.idFactura;
    const facturaModificada = req.body;
    obtenerRespuesta(modificarFactura, modificarFacturaBD, req, res, next, idFactura, facturaModificada);
  });

router.delete("/factura/:idFactura",
  check("idFactura", "No existe la factura").custom(compruebaId),
  async (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const idFactura = +req.params.idFactura;
    obtenerRespuesta(borrarFactura, borrarFacturaBD, req, res, next, idFactura);
  });

module.exports = router;
