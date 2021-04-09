const camposOrden = ["fecha", "base"];
const { generaError } = require("./errors");

const facturasParamsQuery = (queryParams, facturas) => {
  const resultado = {
    facturasResult: { total: null, datos: facturas },
    error: null
  };
  for (const queryField in queryParams) {
    if (queryField === "abonadas") {
      resultado.facturasResult.datos = resultado.facturasResult.datos.filter(factura => `${factura.abonada}` === queryParams[queryField]);
    } else if (queryField === "vencidas") {
      resultado.facturasResult.datos = resultado.facturasResult.datos.filter(factura => (`${factura.vencimiento > new Date().getTime()}`) === queryParams[queryField]);
    } else if (queryField === "ordenPor") {
      const campo = queryParams[queryField];
      if (camposOrden.includes(campo)) {
        if (queryParams.orden) {
          if (queryParams.orden === "asc") resultado.facturasResult.datos = [...resultado.facturasResult.datos].sort((a, b) => a[campo] - b[campo]);
          else if (queryParams.orden === "desc") {
            resultado.facturasResult.datos = [...resultado.facturasResult.datos].sort((a, b) => b[campo] - a[campo]);
          } else {
            facturas = null;
            resultado.error = generaError("el orden solo puede ser asc o desc", 400);
          }
        } else {
          resultado.facturasResult.datos = [...resultado.facturasResult.datos].sort((a, b) => a[campo] - b[campo]);
        }
      } else {
        facturas = null;
        resultado.error = generaError("solo puedes ordenar por base o fecha", 400);
      }
    } else if (queryField === "orden" || queryField === "nPorPagina" || queryField === "pagina") {
      // estos parametros son tratados despues de los filtros
    } else {
      facturas = null;
      resultado.error = generaError("Parametro query no existenete", 400);
    }
  }
  if (queryParams.nPorPagina) {
    if (queryParams.pagina) {
      const nPorPagina = queryParams.nPorPagina;
      const pagStart = nPorPagina * (queryParams.pagina - 1);
      resultado.facturasResult.datos = resultado.facturasResult.datos.slice(pagStart, pagStart + nPorPagina);
    }
    resultado.facturasResult.datos = resultado.facturasResult.datos.slice(0, queryParams.nPorPagina);
  }
  if (queryParams.pagina && !queryParams.nPorPagina) {
    const nPorPagina = 5;
    const pagStart = nPorPagina * (queryParams.pagina - 1);
    resultado.facturasResult.datos = resultado.facturasResult.datos.slice(pagStart, pagStart + nPorPagina);
  }

  return { error: resultado.error, facturas: { total: resultado.facturasResult.datos.length, datos: resultado.facturasResult.datos } };
};

module.exports = facturasParamsQuery;
