const Proyecto = require("../db/models/proyecto");

const getProyectos = async queryParams => {
  const listaProyectos = Proyecto.find();
  return listaProyectos;
};

module.exports = { getProyectos };
