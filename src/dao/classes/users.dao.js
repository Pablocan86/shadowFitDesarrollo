const userModel = require("../models/user.model.js");
const profesorModel = require("../models/profesor.model.js");

class UserManager {
  constructor() {}

  async traeUsuarios() {
    let usuarios = userModel.find().lean();
    return usuarios;
  }
  async traerProfesores() {
    let profesores = profesorModel.find().lean();
    return profesores;
  }

  async traeUnUsuario(uid) {
    let usuario = userModel.findById(uid).lean();
    return usuario;
  }

  async traeUnProfesor(uid) {
    let profesor = profesorModel.findById(uid).lean();
    return profesor;
  }

  async cargarAlumnos(pid, uid) {
    let profesor = await profesorModel.findById(pid);
    profesor.alumnos.push(uid);
    await profesor.save();
  }

  async cargarRutina(uid, rutina) {
    let alumno = await userModel.findById(uid);
    alumno.rutinas.push(rutina);
    await alumno.save();
  }

  async traeUnUsuarioEmail(email) {
    let usuario = userModel.findOne({ email: email });
    return usuario;
  }

  async traeUnProfesorEmail(email) {
    let profesor = profesorModel.findOne({ email: email });
    return profesor;
  }

  async crearUsuario(usuario) {
    let result = await userModel.create(usuario);
    return result;
  }

  async crearProfesor(profesor) {
    let result = await profesorModel.create(profesor);
    return result;
  }

  async actualizaUsuario(uid, usuarioActualizado) {
    let result = await userModel.findByIdAndUpdate(
      { _id: uid },
      usuarioActualizado
    );
    return result;
  }
  async actualizaPropiedad(uid, valor) {
    let result = await userModel.updateOne({ _id: uid }, valor);
    return result;
  }
  async actualizaPropiedadProfesor(uid, valor) {
    let result = await profesorModel.updateOne({ _id: uid }, valor);
    return result;
  }
}

module.exports = UserManager;
