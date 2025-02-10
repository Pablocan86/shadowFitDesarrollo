const mongoose = require("mongoose");

const rutinaCollection = "rutina";

const rutinaSchema = new mongoose.Schema({
  profesor: { type: String },
  alumno: { type: String },
  objetivo: { type: String },
  rutina: { type: String },
  fecha: { type: String },
});

const rutinaModel = mongoose.model(rutinaCollection, rutinaSchema);

module.exports = rutinaModel;
