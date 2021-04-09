const { program } = require("commander");

program.option("-p, --puerto <puerto>", "Puerto para el servidor",)
  .option("-d, --datos <datos>", "Fuente de los datos, JSON o MySQL");

program.parse();

module.exports = program.opts();
