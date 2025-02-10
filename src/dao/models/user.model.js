const mongoose = require("mongoose");

const userCollection = "usuarios";

const userSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  cumpleanos: String,
  fecha_registro: String,
  foto_perfil: {
    data: Buffer,
    contentType: String,
  },
  profesor: { type: String, default: "" },
  rutinas: {
    type: [
      {
        fecha: { type: String },
        vistaAlumno: { type: String },
        vistaProfesor: { type: String },
      },
    ],
    default: [],
  },
  rol: { type: String, default: "alumno" },
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;
