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
  eliminaFactura
} = require("../controladores/facturas");

const getFacturaSchema = type => {
  const numero = {
    isLength: {
      errorMessage: "El número tiene que tener 4 carácteres como mínimo",
      options: {
        min: 4
      }
    }
  };
  const fecha = {
    errorMessage: "Falta la fecha de la factura",
    notEmpty: true
  };
  const base = {
    isFloat: {
      errorMessage: "La base no es válida",
      options: {
        min: 0,
      }
    }
  };
  const tipoIva = {
    isInt: {
      errorMessage: "El tipo de Iva tiene que ser un número entero",
      notEmpty: true
    }
  };
  const tipo = {
    isLength: {
      errorMessage: "El tipo ingresado no es válido",
      notEmpty: true
    }
  };
  switch (type) {
    case "completo":
      numero.exists = {
        errorMessage: "Falta el numero de la factura",
      };
      fecha.exists = true;
      base.exists = {
        errorMessage: "Falta la base de la factura"
      };
      tipoIva.exists = true;
      tipo.exists = true;
      break;
    case "parcial":
    default:
      numero.optional = true;
      fecha.optional = true;
      base.optional = true;
      tipoIva.optional = true;
      tipo.optional = true;
      break;
  }
};
const getFacturaCompleta = getFacturaSchema("completo");
const getFacturaParcial = getFacturaSchema("parcial");

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
  checkSchema(getFacturaCompleta);
  const nuevaFactura = req.body;
  const { factura, error } = creaFactura(nuevaFactura);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
});
router.patch("/factura/:idFactura", (req, res, next) => {
  checkSchema(getFacturaParcial);
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
  checkSchema(getFacturaCompleta);
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
