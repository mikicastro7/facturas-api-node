require("dotenv").config();
const debug = require("debug")("alumnos:root");
const morgan = require("morgan");
const chalk = require("chalk");
const express = require("express");
const cors = require("cors");
const options = require("./parametrosCLI");
const rutasFacturas = require("./rutas/facturas");
const {
  generaError, serverError, notFoundError, generalError
} = require("./utils/errors");

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(chalk.yellow(`Servidor escuchando en el puerto ${puerto}`));
});

server.on("error", err => serverError(err, puerto));

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/facturas", rutasFacturas);

app.use(notFoundError);
app.use(generalError);
