const express = require("express");
// const { checkSchema, check } = require("express-validator");
const { getProyectos } = require("../controladores/proyectosController");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const listaProyectos = await getProyectos(req.query);
  res.json(listaProyectos);
});

module.exports = router;
