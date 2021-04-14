const Proyecto = require("../db/models/proyecto");

const getProyectos = async (queryParams, tipo) => {
  let listaProyectos;
  if (tipo === "pendientes") {
    listaProyectos = await Proyecto.find({ estado: "pendiente" });
  } else if (tipo === "en-progreso") {
    listaProyectos = await Proyecto.find({ estado: "wip" });
  } else if (tipo === "finalizados") {
    listaProyectos = await Proyecto.find({ estado: "finalizado" });
  } else listaProyectos = await Proyecto.find();
  return listaProyectos;
};
module.exports = { getProyectos };
