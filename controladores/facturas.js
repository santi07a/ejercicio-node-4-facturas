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

const getFactura = id => {
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

const creaFactura = nuevaFactura => {
  const respuesta = {
    factura: null,
    error: null
  };
  if (facturasJSON.find(factura => factura.numero === nuevaFactura.numero)) {
    const error = generaError("Ya existe la factura", 409);
    respuesta.error = error;
  }
  if (!respuesta.error) {
    nuevaFactura.id = facturasJSON[facturasJSON.length - 1].id + 1;
    facturasJSON.push(nuevaFactura);
    respuesta.factura = nuevaFactura;
  }
  return respuesta;
};
const sustituyeFactura = (id, facturaModificada) => {
  const factura = facturasJSON.find(factura => factura.id === id);
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {
    facturaModificada.id = factura.id;
    facturasJSON[facturasJSON.indexOf(factura)] = facturaModificada;
    respuesta.factura = facturaModificada;
  } else {
    const { error, factura } = creaFactura(facturaModificada);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.factura = factura;
    }
  }
  return respuesta;
};

const modificaFactura = (id, cambios) => {
  const factura = facturasJSON.find(factura => factura.id === id);
  const respuesta = {
    factura: null,
    error: null
  };
  const facturaModificada = {
    ...factura,
    ...cambios
  };
  facturasJSON[facturasJSON.indexOf(factura)] = facturaModificada;
  respuesta.factura = facturaModificada;
  return respuesta;
};
module.exports = {
  getFacturasTipo, getFacturas, getFactura, creaFactura, sustituyeFactura
};
