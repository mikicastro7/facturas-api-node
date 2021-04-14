const { Schema } = require("mongoose");
const Proyecto = require("../db/modelos/proyectos");
const { generaError } = require("../utils/errors");

const objectFilter = (query) => {
  const resultado = {};
  if (query.tecnologias) {
    const tecnologias = query.tecnologias.split(",");
    resultado.$and = tecnologias.map(tecnologia => ({ tecnologias: tecnologia }));
  }
  if (query.vencidos) {
    if (query.vencidos === "true") {
      resultado.entrega = { $gt: new Date().getTime() };
    } else if (query.vencidos === "false") {
      resultado.entrega = { $lt: new Date().getTime() };
    } else {
      resultado.error = generaError("true o false vencidas", 400);
    }
  }
  return resultado;
};

const getProyectos = async (query) => {
  const objetoFilter = objectFilter(query);
  const result = {
    proyectos: null,
    error: null
  };
  if (objetoFilter.error) {
    result.error = objetoFilter.error;
    return result;
  }
  const proyectos = Proyecto.find(objetoFilter);

  if (query.ordenPor === "fecha" || query.ordenPor === "nombre") {
    if (query.orden) {
      const ordenPor = query.ordenPor;
      proyectos.sort({ [ordenPor]: query.orden });
    } else {
      proyectos.sort(query.ordenPor);
    }
  } else {
    result.error = generaError("ordena por fecha o nombre", 400);
  }
  if (query.nPorPagina) {
    if (query.pagina) {
      proyectos.skip(query.nPorPagina * query.pagina);
    }
    proyectos.limit(+query.nPorPagina);
  }
  result.proyectos = await proyectos;
  return result;
};

const getProyectosNoParamsQuery = async (query) => {
  const proyectos = Proyecto.find(query);
  return proyectos;
};

const getProyecto = async (id) => {
  const proyecto = Proyecto.findById(id);
  return proyecto;
};

const crearProyecto = async (nuevoProyecto) => {
  const nuevoProyectoBD = await Proyecto.create(nuevoProyecto);

  return nuevoProyectoBD;
};

const sustituirProyecto = async (id, proyecto) => {
  const proyectoEncontrado = await Proyecto.findById(id);
  let nuevoProyecto;

  if (proyectoEncontrado) {
    await proyectoEncontrado.updateOne(proyecto);
    nuevoProyecto = proyecto;
  } else {
    nuevoProyecto = await crearProyecto(proyecto);
  }

  return nuevoProyecto;
};

const modificarProyecto = async (id, cambios) => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyecto = await Proyecto.findByIdAndUpdate(id, cambios);
  if (proyecto) {
    respuesta.proyecto = proyecto;
  } else {
    const error = generaError("El proyecto no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};

const eliminarProyecto = async (id) => {
  const proyectoEncontrado = await Proyecto.findByIdAndDelete(id);
  const respuesta = {
    proyecto: null,
    error: null
  };
  if (proyectoEncontrado) {
    respuesta.proyecto = proyectoEncontrado;
  } else {
    const error = generaError("El proyecto solicitado no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};

module.exports = {
  getProyectos,
  getProyectosNoParamsQuery,
  getProyecto,
  crearProyecto,
  sustituirProyecto,
  modificarProyecto,
  eliminarProyecto
};
