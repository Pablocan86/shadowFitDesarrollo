const mongoose = require("mongoose");

const profesorCollection = "profesor";

const profesorSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: {
    type: String,
    unique: true,
  },
  foto_perfil: {
    data: Buffer,
    contentType: String,
  },
  password: String,
  cumpleanos: String,
  fecha_registro: String,
  foto_perfil: {
    data: Buffer,
    contentType: String,
  },
  alumnos: { type: [], default: [] },
  rol: { type: String, default: "profesor" },
});

const profesorModel = mongoose.model(profesorCollection, profesorSchema);

module.exports = profesorModel;
