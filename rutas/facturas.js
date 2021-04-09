const express = require("express");
const { checkSchema, check } = require("express-validator");

const router = express.Router();
const facturasJSON = require("../facturas.json").facturas;
const { badRequestError, idNoExisteError } = require("../utils/errors");

const {
  getFacturas, getFactura, getFacturasTipo, crearFactura, sustituirFactura, modificarFactura
} = require("../controladores/facturasController");

const compruebaId = idFactura => facturasJSON.find(factura => factura.id === +idFactura);

const getFacturaShema = tipoValidacion => {
  const vencimiento = {
    optional: true,
  };
  const base = {
    isFloat: {
      errorMessage: "la base es un float",
    }
  };
  const tipoIva = {
    isInt: {
      errorMessage: "El tipo IVA es integer",
    }
  };
  const tipo = {
    custom: {
      options: value => value === "gasto" || value === "ingreso"
    }
  };

  switch (tipoValidacion) {
    case "completo":
      base.exists = {
        errorMessage: "Falta la base"
      };
      tipoIva.exists = true;
      tipo.exists = true;
      break;
    case "parcial":
    default:
      base.optional = true;
      tipoIva.optional = true;
      tipo.optional = true;
      break;
  }

  return {
    vencimiento,
    base,
    tipoIva,
    tipo
  };
};

const facturaCompletaSchema = getFacturaShema("completo");
const facturaParcialSchema = getFacturaShema("parcial");

router.get("/", (req, res, next) => {
  const { facturas, error } = getFacturas(req.query);
  if (error) {
    next(error);
  } else {
    res.json(facturas);
  }
});

router.get("/factura/:idFactura",
  check("idFactura", "No existe la factura").custom(compruebaId),
  (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const idFacura = +req.params.idFactura;
    const { factura, error } = getFactura(idFacura);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });

router.get("/ingresos", (req, res, next) => {
  const { facturas, error } = getFacturasTipo("ingreso", req.query);
  if (error) {
    next(error);
  } else {
    res.json(facturas);
  }
});

router.get("/gastos", (req, res, next) => {
  const { facturas, error } = getFacturasTipo("gasto", req.query);
  if (error) {
    next(error);
  } else {
    res.json(facturas);
  }
});

router.post("/factura",
  checkSchema(facturaCompletaSchema),
  (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const nuevaFactura = req.body;
    const { factura, error } = crearFactura(nuevaFactura);
    if (error) {
      next(error);
    } else {
      res.json({ factura });
    }
  });

router.put("/factura/:idFactura",
  checkSchema(facturaCompletaSchema),
  (req, res, next) => {
    console.log(req.body);
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const nuevaFactura = req.body;
    console.log(nuevaFactura);
    const { factura, error } = sustituirFactura(+req.params.idFactura, nuevaFactura);
    if (error) {
      next(error);
    } else {
      res.json({ factura });
    }
  });

router.patch("/factura/:idFactura",
  checkSchema(facturaParcialSchema),
  (req, res, next) => {
    console.log(req.body);
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const errorIdNoExiste = idNoExisteError(req);
    if (errorIdNoExiste) {
      return next(errorIdNoExiste);
    }
    const idFactura = +req.params.idFactura;
    const facturaModificada = req.body;
    const { error, factura } = modificarFactura(idFactura, facturaModificada);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });

module.exports = router;
