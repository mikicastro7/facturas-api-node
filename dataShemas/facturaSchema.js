const getFacturaShema = tipoValidacion => {
  const vencimiento = {
    optional: true,
  };
  const base = {
    isFloat: {
      errorMessage: "la base es un float",
    }
  };
  const tipoIva = {
    isInt: {
      errorMessage: "El tipo IVA es integer",
    }
  };
  const tipo = {
    custom: {
      options: value => value === "gasto" || value === "ingreso"
    }
  };

  switch (tipoValidacion) {
    case "completo":
      base.exists = {
        errorMessage: "Falta la base"
      };
      tipoIva.exists = true;
      tipo.exists = true;
      break;
    case "parcial":
    default:
      base.optional = true;
      tipoIva.optional = true;
      tipo.optional = true;
      break;
  }

  return {
    vencimiento,
    base,
    tipoIva,
    tipo
  };
};

module.exports = getFacturaShema;
