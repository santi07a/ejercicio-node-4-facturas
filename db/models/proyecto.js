const { Schema, model } = require("mongoose");

const ProyectoSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    required: true
  },
  aprobado: {
    type: Date,
    default: new Date()
  },
  entrega: {
    type: Date,
    default: new Date()
  },
  cliente: {
    type: String,
    required: true
  },
  tecnologias: {
    type: Array
  }
});

const Proyecto = model("Proyecto", ProyectoSchema, "proyectos");

module.exports = Proyecto;
