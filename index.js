require("dotenv").config();
const debug = require("debug")("facturas:root");
const express = require("express");
const morgan = require("morgan");
const { program } = require("commander");
const chalk = require("chalk");
const cors = require("cors");
const options = require("./parametrosCLI");
const rutaFacturas = require("./rutas/facturas");
const rutaProyectos = require("./rutas/proyectos");
require("./db/mongodb");

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(chalk.red.bold(`Servidor levantado en el puerto ${puerto}`));
});
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/facturas", rutaFacturas);
app.use("/proyectos", rutaProyectos);
app.get("/", (req, res, next) => {
  res.redirect("/facturas");
});
