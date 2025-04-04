const mongoose = require("mongoose");

const userCollection = "usuarios";

const userSchema = new mongoose.Schema({
  nombre: { type: String },
  apellido: { type: String },
  email: {
    type: String,
    unique: true,
  },
  telefono: {
    type: Number,
    unique: true,
  },
  password: { type: String },
  cumpleanos: { type: String },
  fecha_registro: { type: String },
  foto_perfil: {
    type: String,
    default: "",
  },
  profesor: { type: String, default: "" },
  rutinas: {
    type: [
      {
        fecha: { type: String },
        nombreArchivo: { type: String },
        vistaAlumno: { type: String },
        vistaProfesor: { type: String },
      },
    ],
    default: [],
  },
  dietas: {
    type: [
      {
        fecha: { type: String },
        nombreArchivo: { type: String },
      },
    ],
    default: [],
  },
  progresos: {
    type: [
      {
        fecha: { type: String },
        fotoFrente: { type: String },
        fotoPerfil: { type: String },
        fotoEspalda: { type: String },
      },
    ],
    default: [],
  },
  rol: { type: String, default: "alumno" },
  code: { type: String, required: true },
  status: { type: String, required: true, default: "UNIVERIFIED" },
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;
