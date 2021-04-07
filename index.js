require("dotenv").config();
const debug = require("debug")("facturas:root");
const express = require("express");
const morgan = require("morgan");
const { program } = require("commander");
const chalk = require("chalk");
const cors = require("cors");
const options = require("./parametrosCLI");
const facturasJSON = require("./facturas.json");
const rutaFacturas = require("./rutas/facturas");

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(chalk.red.bold(`Servidor levantado en el puerto ${puerto}`));
});

app.use(morgan("dev"));
app.use(cors());
app.use("/facturas", rutaFacturas);
app.get("/", (req, res, next) => {
  res.redirect("/facturas");
});
