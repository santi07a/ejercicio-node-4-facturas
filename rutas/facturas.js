const { DateTime } = require("luxon");
const express = require("express");
const { checkSchema } = require("express-validator");
const facturasJSON = require("..");

const router = express.Router();
const {
  getFacturas,
  getFactura,
  creaFactura,
  sustituyeFactura,
  modificaFactura,
  eliminaFactura,
} = require("../controladores/facturas");

const baseFacturas = facturas => ({
  total: facturas.length,
  datos: facturas
});

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
  const queryParams = req.query;
  const listaFacturas = getFacturas(queryParams);
  res.json(baseFacturas(listaFacturas));
});

router.get("/ingresos", (req, res, next) => {
  const queryParams = req.query;
  const listaFacturas = getFacturas(queryParams, "ingreso");
  res.json(baseFacturas(listaFacturas));
});
router.get("/gastos", (req, res, next) => {
  const queryParams = req.query;
  const listaFacturas = getFacturas(queryParams, "gasto");
  res.json(baseFacturas(listaFacturas));
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
router.post("/factura/:idFactura", checkSchema(getFacturaSchema()),
  (req, res, next) => {
    const nuevaFactura = req.body;
    const { factura, error } = creaFactura(nuevaFactura);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });
router.patch("/factura/:idFactura", checkSchema(getFacturaSchema()),
  (req, res, next) => {
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

router.put("/factura/:idFactura", checkSchema(getFacturaSchema),
  (req, res, next) => {
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
