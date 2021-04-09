const { DateTime } = require("luxon");
const options = require("../parametrosCLI");
let facturasJSON = require("../facturas.json").facturas;
const { generaError } = require("../utiles/errores");
const Factura = require("../db/models/factura");

const getFacturas = async (reqQuery, tipo) => {
  let listaFacturas = facturasJSON;
  if (options.datos.toLowerCase() === "json") {
    if (tipo) {
      listaFacturas = facturasJSON.filter(factura => factura.tipo === tipo);
    } else {
      listaFacturas = facturasJSON;
    }
  } else if (options.datos.toLowerCase() === "mysql") {
    if (tipo) {
      listaFacturas = await Factura.findAll(
        {
          where: {
            tipo
          }
        }
      );
    } else {
      listaFacturas = Factura.findAll();
    }
  } else {
    return generaError("El parámetro de entrada debe ser 'JSON' o 'MySQL'", 400);
  }
  if (reqQuery.abonadas === "true") {
    listaFacturas = listaFacturas.filter(factura => factura.abonada === true);
  } else if (reqQuery.abonadas === "false") {
    listaFacturas = listaFacturas.filter(factura => factura.abonada === false);
  }
  if (reqQuery.vencidas === "true") {
    listaFacturas = listaFacturas.filter(factura => verificaVencimiento(factura.vencimiento) === true);
  } else if (reqQuery.vencidas === "true") {
    listaFacturas = listaFacturas.filter(factura => verificaVencimiento(factura.vencimiento) === false);
  }
  if (reqQuery.ordenPor === "fecha") {
    if (reqQuery.orden === "desc") {
      listaFacturas = listaFacturas.sort((a, b) => DateTime.fromMillis(+b.fecha) - DateTime.fromMillis(+a.fecha));
    } else { listaFacturas = listaFacturas.sort((a, b) => DateTime.fromMillis(+a.fecha) - DateTime.fromMillis(+b.fecha)); }
  } else if (reqQuery.ordenPor === "base") {
    if (reqQuery.orden === "desc") {
      listaFacturas = listaFacturas.sort((a, b) => +b.base - +a.base);
    } else { listaFacturas = listaFacturas.sort((a, b) => +a.base - +b.base); }
  }
  if (reqQuery.nPorPagina) {
    if (reqQuery.pagina) {
      listaFacturas = listaFacturas.slice(+reqQuery.pagina * +reqQuery.nPorPagina, (+reqQuery.pagina + 1) * +reqQuery.nPorPagina);
    } else {
      listaFacturas = listaFacturas.slice(0, +reqQuery.nPorPagina);
    }
  } return listaFacturas;
};

const getFactura = async id => {
  let factura;
  if (options.datos.toLowerCase() === "json") {
    factura = facturasJSON.find(factura => factura.id === id);
  } else if (options.datos.toLowerCase() === "mysql") {
    factura = await Factura.findByPk(id);
  }
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

const eliminaFactura = idFactura => {
  const respuesta = {
    factura: null,
    error: null
  };
  const factura = facturasJSON.find(factura => factura.id === idFactura);
  facturasJSON = facturasJSON.filter(factura => factura.id !== idFactura);
  respuesta.factura = factura;
  return respuesta;
};

const verificaVencimiento = (vencimiento) => {
  const fechaHoy = DateTime.local();
  const fechaVencimiento = DateTime.fromMillis(+vencimiento);
  if (fechaVencimiento > fechaHoy) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getFacturas,
  getFactura,
  creaFactura,
  sustituyeFactura,
  modificaFactura,
  eliminaFactura,
  verificaVencimiento
};
