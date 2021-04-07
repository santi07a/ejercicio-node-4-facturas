const express = require("express");
const { checkSchema, check, validationResult } = require("express-validator");

const router = express.Router();
const facturasJSON = require("../facturas.json").facturas;
const { getFacturasTipo, getFacturas, factura } = require("../controladores/facturas");

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
  res.json(factura(id));
});
router.post("/factura/:idFactura", (req, res, next) => {
  const nuevaFactura = req.body;
  res.json(nuevaFactura);
});
router.put("/factura/:idFactura", (req, res, next) => {
  res.json();
});
router.delete("/factura/:idFactura", (req, res, next) => {
  res.json();
});
router.patch("/factura/:idFactura", (req, res, next) => {
  res.json();
});

module.exports = router;
