const facturasJSON = require("../facturas.json").facturas;
const { generaError } = require("../utiles/errores");

const getFacturas = () => facturasJSON.map(factura => ({
  total: factura.base + ((factura.base * factura.tipoIva) / 100),
  datos: factura
}));

const getFacturasTipo = (tipo) => facturasJSON.filter(factura => factura.tipo === tipo)
  .map(factura => ({
    total: factura.base + ((factura.base * factura.tipoIva) / 100),
    datos: factura
  }));

const factura = id => {
  facturasJSON.find(factura => factura.id === id);
  const factura = facturasJSON.find(factura => factura.id === id);
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {
    respuesta.factura = factura;
  } else {
    const error = generaError("La factura no existe", 404);
    respuesta.error = error;
  }
  return respuesta;
};

module.exports = { getFacturasTipo, getFacturas, factura };
