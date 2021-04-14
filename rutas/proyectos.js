const express = require("express");
const { checkSchema } = require("express-validator");
const {
  getProyectos,
  getProyecto,
  creaProyecto,
  sustituyeProyecto,
  modificarAlumno,
  borrarProyecto
} = require("../controladores/proyectos");
const { errorBadRequest, idInexistente } = require("../utiles/errores");

const router = express.Router();

const baseProyecto = proyectos => ({
  total: proyectos.length,
  datos: proyectos
});

const getProyectoSchema = tipo => {
  const nombre = {
    errorMessage: "ingresa el nombre correctamente",
    notEmpty: true
  };
  const estado = {
    errorMessage: "el estado ingresado es inválido",
    notEmpty: true
  };
  const aprobado = {
    errorMessage: "Debes poner una fecha de aprobado válida",
  };
  const entrega = {
    errorMessage: "Debes poner una fecha de entrega válida",
  };
  const cliente = {
    errorMessage: "escribe el nombre del cliente",
    notEmpty: true
  };
  const tecnologias = {
    errorMessage: "tienes que especificar que tecnologías serán las utilizadas",
    notEmpty: true
  };
  switch (tipo) {
    case "completo":
      nombre.exists = {
        errorMessage: "Falta el nombre del proyecto",
      };
      estado.exists = true;
      aprobado.exists = {
        errorMessage: "Tienes que pasarle una fecha en timestamp"
      };
      entrega.exists = true;
      cliente.exists = {
        errorMessage: "Falta el nombre del cliente"
      };
      tecnologias.exists = true;
      break;
    case "parcial":
    default:
      nombre.optional = true;
      estado.optional = true;
      aprobado.optional = true;
      entrega.optional = true;
      cliente.optional = true;
      tecnologias.optional = true;
  }
  return {
    nombre,
    estado,
    aprobado,
    entrega,
    cliente,
    tecnologias
  };
};

const proyectoCompletoSchema = getProyectoSchema("completo");
const proyectoParcialSchema = getProyectoSchema("parcial");

router.get("/", async (req, res, next) => {
  const queryParams = req.query;
  const listaProyectos = await getProyectos(queryParams);
  res.json(baseProyecto(listaProyectos));
});
router.get("/pendientes", async (req, res, next) => {
  const queryParams = req.query;
  const listaProyectos = await getProyectos(queryParams, "pendientes");
  res.json(baseProyecto(listaProyectos));
});
router.get("/en-progreso", async (req, res, next) => {
  const queryParams = req.query;
  const listaProyectos = await getProyectos(queryParams, "en-progreso");
  res.json(baseProyecto(listaProyectos));
});
router.get("/finalizados", async (req, res, next) => {
  const queryParams = req.query;
  const listaProyectos = await getProyectos(queryParams, "finalizados");
  res.json(baseProyecto(listaProyectos));
});
router.get("/proyecto/:idProyecto", async (req, res, next) => {
  const id = req.params.idProyecto;
  const { proyecto, error } = await getProyecto(id);
  if (error) {
    return next(error);
  } else {
    res.json(proyecto);
  }
});
router.post("/proyecto", checkSchema(proyectoCompletoSchema),
  async (req, res, next) => {
    const error400 = errorBadRequest(req);
    if (error400) {
      return next(error400);
    }
    const nuevoProyecto = req.body;
    const { proyecto, error } = await creaProyecto(nuevoProyecto);
    if (error) {
      next(error);
    } else {
      res.status(201).json({ _id: proyecto.id });
    }
  });
router.put("/proyecto/:idProyecto", checkSchema(proyectoCompletoSchema),
  async (req, res, next) => {
    const error400 = errorBadRequest(req);
    if (error400) {
      return next(error400);
    }
    const idProyecto = req.params.id;
    const proyectoModificado = req.body;
    const { proyecto, error } = await sustituyeProyecto(idProyecto, proyectoModificado);
    if (error) {
      next(error);
    } else {
      res.json(proyecto);
    }
  });
router.patch("/proyecto/:idProyecto", checkSchema(proyectoParcialSchema),
  async (req, res, next) => {
    const error400 = errorBadRequest(req);
    if (error400) {
      return next(error400);
    }
    const idNoExiste = await idInexistente(req);
    if (idNoExiste) {
      return next(idNoExiste);
    }
    const idProyecto = req.params.id;
    const proyectoModificado = req.body;
    const { error, proyecto } = await modificarAlumno(idProyecto, proyectoModificado);
    if (error) {
      next(error);
    } else {
      res.json(proyecto);
    }
  });
router.delete("/proyecto/:idProyecto", async (req, res, next) => {
  const idProyecto = req.params.id;
  const { proyecto, error } = await borrarProyecto(idProyecto);
  if (error) {
    next(error);
  } else {
    res.json(proyecto);
  }
});
module.exports = router;
