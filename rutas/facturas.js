const express = require("express");

const router = express.Router();
const facturasJSON = require("../facturas.json").facturas;

const {
  getFacturas, getFactura, getFacturasTipo, crearFactura
} = require("../controladores/facturasController");

router.get("/", (req, res, next) => res.json(getFacturas()));

router.get("/factura/:idFactura", (req, res, next) => {
  const idFacura = +req.params.idFactura;
  const { factura, error } = getFactura(idFacura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

router.get("/ingresos", (req, res, next) => res.json(getFacturasTipo("ingreso")));

router.get("/gastos", (req, res, next) => {
  const facturasGasto = res.json(getFacturasTipo("gasto"));
});

router.post("/factura",
  (req, res, next) => {
    const nuevaFactura = req.body;
    console.log(nuevaFactura);
    const { factura, error } = crearFactura(nuevaFactura);
    if (error) {
      next(error);
    } else {
      res.json({ id: factura.id });
    }
  });

module.exports = router;
