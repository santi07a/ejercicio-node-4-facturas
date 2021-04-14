const express = require("express");
const { checkSchema } = require("express-validator");
const { getProyectos } = require("../controladores/proyectos");

const router = express.Router();

const baseProyecto = proyectos => ({
  total: proyectos.length,
  datos: proyectos
});

const getProyectoSchema = () => {
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
  return {
    nombre,
    estado,
    aprobado,
    entrega,
    cliente,
    tecnologias
  };
};

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
module.exports = router;
