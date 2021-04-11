const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");

const Factura = sequelize.define("factura", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  numero: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  fecha: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  vencimiento: {
    type: DataTypes.STRING(15),
  },
  concepto: {
    type: DataTypes.TEXT,
  },
  base: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tipoIva: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
  },
  abonada: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
});

module.exports = Factura;
