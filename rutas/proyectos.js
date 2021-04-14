const express = require("express");
// const { checkSchema, check } = require("express-validator");
const {
  getProyectos, getProyectosNoParamsQuery, getProyecto, crearProyecto, sustituirProyecto, modificarProyecto, eliminarProyecto
} = require("../controladores/proyectosController");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const { proyectos, error } = await getProyectos(req.query);
  if (error) {
    next(error);
  } else {
    res.json(proyectos);
  }
});

router.get("/pendientes", async (req, res, next) => {
  const proyectos = await getProyectosNoParamsQuery({ estado: "pendiente" });
  res.json(proyectos);
});

router.get("/en-progreso", async (req, res, next) => {
  const proyectos = await getProyectosNoParamsQuery({ estado: "wip" });
  res.json(proyectos);
});

router.get("/finalizados", async (req, res, next) => {
  const proyectos = await getProyectosNoParamsQuery({ estado: "finalizado" });
  res.json(proyectos);
});

router.get("/proyecto/:idProyecto", async (req, res, next) => {
  const id = req.params.idProyecto;
  const proyecto = await getProyecto(id);
  res.json(proyecto);
});

router.post("/proyecto", async (req, res, next) => {
  const proyecto = await crearProyecto(req.body);
  res.json(proyecto);
});

router.put("/proyecto/:idProyecto", async (req, res, next) => {
  const id = req.params.idProyecto;
  const proyecto = await sustituirProyecto(id, req.body);
  res.json(proyecto);
});

router.patch("/proyecto/:idProyecto", async (req, res, next) => {
  const id = req.params.idProyecto;
  const { proyecto, error } = await modificarProyecto(id, req.body);
  if (error) {
    next(error);
  } else {
    res.json(proyecto);
  }
});

router.delete("/proyecto/:idProyecto", async (req, res, next) => {
  const id = req.params.idProyecto;
  const { proyecto, error } = await eliminarProyecto(id);
  if (error) {
    next(error);
  } else {
    res.json(proyecto);
  }
});

module.exports = router;
