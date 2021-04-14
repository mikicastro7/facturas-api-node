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

  }
  return resultado;
};

const getProyectos = async (query) => {
  const objetoFilter = objectFilter(query);
  console.log(objetoFilter);
  const proyectos = await Proyecto.find(objetoFilter);
  return proyectos;
};

module.exports = {
  getProyectos
};
