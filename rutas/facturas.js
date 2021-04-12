const express = require("express");
const { checkSchema } = require("express-validator");

const router = express.Router();
const {
  getFacturas,
  getFactura,
  creaFactura,
  sustituyeFactura,
  modificaFactura,
  eliminaFactura,
} = require("../controladores/facturas");
const { errorBadRequest } = require("../utiles/errores");

const baseFacturas = facturas => ({
  total: facturas.length,
  datos: facturas
});

const getFacturasSchema = tipoFactura => {
  const numero = {
    isLength: {
      errorMessage: "El numero tiene que tener 4 caracteres",
    }
  };
  const fecha = {
    errorMessage: "Falta la fecha de la factura",
    notEmpty: true
  };
  const vencimiento = {
    optional: true,
    notEmpty: true
  };
  const concepto = {
    optional: true,
    notEmpty: true
  };
  const base = {
    isFloat: {
      errorMessage: "Valor incorrecto, debe ser un numero",
      options: {
        min: 0
      }
    }
  };
  const tipoIva = {
    isInt: {
      errorMessage: "Valor incorrecto, debe ser un numero",
      notEmpty: true
    }
  };
  const tipo = {
    custom: {
      errorMessage: "Valor incorrecto, debe ser un tipo gasto o ingreso",
      options: value => value === "gasto" || value === "ingreso"
    }
  };
  const abonada = {
    errorMessage: "Valor incorrecto, debe ser un numero"
  };
  switch (tipoFactura) {
    case "completo":
      numero.exists = {
        errorMessage: "Falta el numero de la factura"
      };
      fecha.exists = true;
      base.exists = {
        errorMessage: "Falta la base de la factura"
      };
      tipoIva.exists = true;
      tipo.exists = true;
      abonada.exists = true;
      break;
    case "parcial":
    default:
      numero.optional = true;
      fecha.optional = true;
      base.optional = true;
      tipoIva.optional = true;
      tipo.optional = true;
      abonada.optional = true;
      break;
  }

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

const getFacturaCompletaSchema = getFacturasSchema("completo");
const getFacturaParcialSchema = getFacturasSchema("parcial");

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

router.get("/factura/:idFactura", async (req, res, next) => {
  const idFactura = +req.params.idFactura;
  const { factura, error } = await getFactura(idFactura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});

router.post("/factura",
  checkSchema(getFacturaCompletaSchema),
  async (req, res, next) => {
    const facturaNueva = req.body;
    const error400 = errorBadRequest(req);
    if (error400) {
      return next(error400);
    }
    const { factura, error } = await creaFactura(facturaNueva);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });

router.patch("/factura/:idFactura", checkSchema(getFacturaParcialSchema),
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

router.put("/factura/:idFactura", checkSchema(getFacturaCompletaSchema),
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
