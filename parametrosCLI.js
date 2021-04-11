const { program } = require("commander");

program.option("-p, --puerto <puerto>", "Puerto para el servidor");
program.option("-f, --fuente <fuente>", "seleccionar fuente de datos JSON o BD");
program.parse();

module.exports = program.opts();
