const chalk = require("chalk");
const mongoose = require("mongoose");
require("dotenv").config();
const debug = require("debug")("proyectos:mongoDB");

mongoose.connect("mongodb://localhost/proyectos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, err => {
  if (err) {
    debug(chalk.red("No hay conexión con la base de datos"));
    process.exit(1);
  }
  debug(chalk.blueBright("Iniciado el servidor con MongoDB"));
});
