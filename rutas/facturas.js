const express = require("express");
const { checkSchema, check, validationResult } = require("express-validator");

const router = express.Router();
const facturasJSON = require("../facturas.json").facturas;
const {
  getFacturasTipo, getFacturas, getFactura, creaFactura, sustituyeFactura, modificaFactura
} = require("../controladores/facturas");

router.get("/", (req, res, next) => {
  res.json(getFacturas());
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
  const nuevaFactura = req.body;
  const { factura, error } = creaFactura(nuevaFactura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});
router.patch("/factura/:idFactura", (req, res, next) => {
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
  res.json();
});
router.put("/factura/:idFactura", (req, res, next) => {
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
