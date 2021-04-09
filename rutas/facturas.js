const { DateTime } = require("luxon");
const express = require("express");
const { checkSchema, check, validationResult } = require("express-validator");

const router = express.Router();
const {
  getFacturasTipo,
  getFacturas,
  getFactura,
  creaFactura,
  sustituyeFactura,
  modificaFactura,
  eliminaFactura,
  verificaVencimiento
} = require("../controladores/facturas");

const getFacturaSchema = () => {
  const numero = {
    errorMessage: "Solo acepto números",
    notEmpty: true
  };
  const fecha = {
    errorMessage: "Falta La fecha de la factura",
    notEmpty: true
  };
  const vencimiento = {
    errorMessage: "Debes poner una fecha de vencimiento válida",
  };
  const concepto = {
    errorMessage: "Falta el concepto de la factura",
  };
  const base = {
    isFloat: {
      errorMessage: "La base imponible debe ser válida",
      notEmpty: true,
      options: {
        min: 0
      },
    }
  };
  const tipoIva = {
    isInteger: {
      errorMessage: "El tipo del iva tiene que ser un número sin decimales",
      notEmpty: true
    }
  };
  const tipo = {
    errorMessage: "Falta el tipo de la factura",
    notEmpty: true
  };
  const abonada = {
    errorMessage: "especifica si la factura está abonada",
    notEmpty: true
  };
  return {
    numero,
    fecha,
    vencimiento,
    concepto,
    base,
    tipoIva,
    tipo,
    abonada
  };
};

router.get("/", (req, res, next) => {
  let listaFacturas = getFacturas();
  if (req.query.abonadas === "true") {
    listaFacturas = listaFacturas.filter(factura => factura.datos.abonada === true);
  } else if (req.query.abonadas === "false") {
    listaFacturas = listaFacturas.filter(factura => factura.datos.abonada === false);
  }
  if (req.query.vencidas === "true") {
    listaFacturas = listaFacturas.filter(factura => verificaVencimiento(factura.datos.vencimiento) === true);
  } else if (req.query.vencidas === "true") {
    listaFacturas = listaFacturas.filter(factura => verificaVencimiento(factura.datos.vencimiento) === false);
  }
  if (req.query.ordenPor === "fecha") {
    if (req.query.orden === "desc") {
      listaFacturas = listaFacturas.sort((a, b) => DateTime.fromMillis(+b.datos.fecha) - DateTime.fromMillis(+a.datos.fecha));
    } else { listaFacturas = listaFacturas.sort((a, b) => DateTime.fromMillis(+a.datos.fecha) - DateTime.fromMillis(+b.datos.fecha)); }
  } else if (req.query.ordenPor === "base") {
    if (req.query.orden === "desc") {
      listaFacturas = listaFacturas.sort((a, b) => +b.datos.base - +a.datos.base);
    } else { listaFacturas = listaFacturas.sort((a, b) => +a.datos.base - +b.datos.base); }
  }
  if (req.query.nPorPagina) {
    if (req.query.pagina) {
      listaFacturas = listaFacturas.slice(+req.query.pagina * +req.query.nPorPagina, (+req.query.pagina + 1) * +req.query.nPorPagina);
    } else {
      listaFacturas = listaFacturas.slice(0, +req.query.nPorPagina);
    }
  }
  res.json(listaFacturas);
});

router.get("/ingreso", (req, res, next) => {
  res.json(getFacturasTipo("ingreso"));
});
router.get("/gasto", (req, res, next) => {
  res.json(getFacturasTipo("gasto"));
});
router.get("/factura/:idFactura", (req, res, next) => {
  const id = +req.params.idFactura;
  const { factura, error } = getFactura(id);
  if (error) {
    return next(error);
  } else {
    res.json(factura);
  }
});
router.post("/factura/:idFactura", (req, res, next) => {
  checkSchema(getFacturaSchema());
  const nuevaFactura = req.body;
  const { factura, error } = creaFactura(nuevaFactura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});
router.patch("/factura/:idFactura", (req, res, next) => {
  checkSchema(getFacturaSchema());
  const id = +req.params.id;
  const facturaModificada = req.body;
  const { error, factura } = modificaFactura(id, facturaModificada);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

router.delete("/factura/:idFactura", (req, res, next) => {
  const id = +req.params.id;
  const { error, factura } = eliminaFactura(id);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

router.put("/factura/:idFactura", (req, res, next) => {
  checkSchema(getFacturaSchema);
  const id = +req.params.id;
  const facturaModificada = req.body;
  const { error, factura } = sustituyeFactura(id, facturaModificada);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

module.exports = router;
