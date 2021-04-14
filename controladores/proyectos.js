const Proyecto = require("../db/models/proyecto");
const { generaError } = require("../utiles/errores");

const getProyectos = async (queryParams, tipo) => {
  const condicion = {};
  if (tipo) {
    condicion.estado = tipo;
  }
  if (queryParams.tecnologias) {
    const tecnologias = queryParams.tecnologias.split(", ");
    condicion.tecnologias = {
      $all: tecnologias
    };
  }
  const hoy = new Date().getTime();
  if (queryParams.vencidos) {
    condicion.entrega = queryParams.vencidos === "false" ? { $gte: hoy } : { $lt: hoy };
  }
  const ordenTipo = queryParams.ordenPor === "fecha" ? "entrega" : "nombre";
  const orden = queryParams.orden === "DESC" ? -1 : 1;
  const proyectos = await Proyecto.find(condicion)
    .sort({ [ordenTipo]: orden })
    .limit(queryParams.nPorPagina ? +queryParams.nPorPagina : 0)
    .skip(queryParams.nPorPagina && queryParams.pagina ? (+queryParams.nPorPagina * +queryParams.pagina) - +queryParams.nPorPagina : 0);
  return proyectos;
};

const getProyecto = async id => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyecto = await Proyecto.findById(id);
  if (proyecto) {
    respuesta.proyecto = proyecto;
  } else {
    const error = await generaError("el proyecto no existe", 404);
    respuesta.error = error;
  } return respuesta;
};

const creaProyecto = async proyectoNuevo => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyecto = await Proyecto.findOne({ nombre: proyectoNuevo.nombre });
  if (proyecto) {
    const error = await generaError("el proyecto ya existe", 409);
    respuesta.error = error;
  } else {
    const proyectoCreado = await Proyecto.create(proyectoNuevo);
    respuesta.proyecto = proyectoCreado;
  } return respuesta;
};

const sustituyeProyecto = async (idProyecto, proyectoModificado) => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyectoEncontrado = await Proyecto.findById(idProyecto);
  if (proyectoEncontrado) {
    await proyectoEncontrado.updateOne(proyectoModificado);
  } else {
    const { proyecto, error } = await creaProyecto(proyectoModificado);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.proyecto = proyecto;
    }
  } return respuesta;
};
const modificarAlumno = async (idProyecto, proyectoModificado) => {
  const respuesta = {
    proyecto: null,
    error: null
  };
  const proyecto = await Proyecto.findByIdAndUpdate(idProyecto, proyectoModificado);
  if (proyecto) {
    respuesta.proyecto = proyecto;
  } else {
    const error = await generaError("El proyecto solicitadao no existe", 404);
    respuesta.error = error;
  } return respuesta;
};
const borrarProyecto = async id => {
  const proyectoEliminado = await Proyecto.findByIdAndDelete(id);
  const respuesta = {
    proyecto: null,
    error: null
  };
  if (proyectoEliminado) {
    respuesta.proyecto = proyectoEliminado;
  } else {
    const error = generaError("El proyecto no existe", 404);
    respuesta.error = error;
  } return respuesta;
};
module.exports = {
  getProyectos, getProyecto, creaProyecto, sustituyeProyecto, modificarAlumno, borrarProyecto
};
