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
    isInt: {
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

router.get("/", async (req, res, next) => {
  const queryParams = req.query;
  const listaFacturas = await getFacturas(queryParams);
  res.json(baseFacturas(listaFacturas));
});

router.get("/ingresos", async (req, res, next) => {
  const queryParams = req.query;
  const listaFacturas = await getFacturas(queryParams, "ingreso");
  res.json(baseFacturas(listaFacturas));
});
router.get("/gastos", async (req, res, next) => {
  const queryParams = req.query;
  const listaFacturas = await getFacturas(queryParams, "gasto");
  res.json(baseFacturas(listaFacturas));
});

const compruebaId = id => facturasJSON.find(factura => factura.id === +id);

router.get("/factura/:idFactura", async (req, res, next) => {
  const id = +req.params.idFactura;
  const { factura, error } = await getFactura(id);
  if (error) {
    return next(error);
  } else {
    res.json(factura);
  }
});
router.post("/factura/:idFactura", checkSchema(getFacturaSchema()),
  async (req, res, next) => {
    const nuevaFactura = req.body;
    const { factura, error } = await creaFactura(nuevaFactura);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });
router.patch("/factura/:idFactura", checkSchema(getFacturaSchema()),
  async (req, res, next) => {
    const id = +req.params.id;
    const facturaModificada = req.body;
    const { error, factura } = await modificaFactura(id, facturaModificada);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });

router.delete("/factura/:idFactura", async (req, res, next) => {
  const id = +req.params.id;
  const { error, factura } = await eliminaFactura(id);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

router.put("/factura/:idFactura", checkSchema(getFacturaSchema),
  async (req, res, next) => {
    const id = +req.params.id;
    const facturaModificada = req.body;
    const { error, factura } = await sustituyeFactura(id, facturaModificada);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });

module.exports = router;
