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

const getFacturaSchema = () => {
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
    errorMessage: "El tipo debe ser ingreso o gasto",
    options: {
    }
  };
};

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
  const id = +req.params.id;
  const { error, factura } = eliminaFactura(id);
  if (error) {
    next(error);
  } else {
    res.json(factura);
  }
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
