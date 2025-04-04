const UserManager = require("../dao/classes/users.dao.js");
const { createHash, isValidPassword } = require("../utils.js");
const { Buffer } = require("buffer");
const userService = new UserManager();
const { transport } = require("../config/mail.config.js");
const { getFiles, uploadFile, getFileURL } = require("../config/s3.js");
const { crearPDF } = require("../midlewars/descargarPDF.js");
const { getTokenData } = require("../config/jwt.config.js");

exports.confirm = async (req, res) => {
  try {
    //Obtener token
    const { token } = req.params;
    //Verificar la data
    const data = await getTokenData(token);

    const { email, code } = data.data;

    if (data === null) {
      return res.json({
        succes: false,
        msg: "Error al recibir data",
      });
    }

    //Buscar si existe usuario
    const user = await userService.traeUnUsuarioEmail(email);
    //Verificar el código
    if (code !== user.code) {
      res.render("register", {
        style: "registro.css",
        title: "Registro Alumnos",
        message: "Error en la verificación",
      });
    }
    // Actualizar usuario y redireccionar a confirmación
    await userService.actualizaPropiedad(user._id, { status: "VERIFICATED" });
    return res.render("register", {
      style: "registro.css",
      title: "Registro Alumnos",
      message: "Correo verificado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      succes: false,
      msg: "Error al confirmar",
    });
  }
};
exports.traeUsuarios = async (req, res) => {
  try {
    let usuarios = await userService.traeUsuarios();
    res.send(usuarios);
  } catch (error) {
    console.error(error);
    res.json({ message: `No se encuentran usuarios` });
  }
};

exports.perfilAlumno = async (req, res) => {
  let { uid } = req.params;
  try {
    let isProfesor = true;
    let profesor;
    let usuario = await userService.traeUnUsuario(uid);

    let profesores = await userService.traerProfesores();

    if (usuario.profesor === "") {
      isProfesor = false;
    } else {
      profesor = await userService.traeUnProfesor(usuario.profesor);
    }

    res.render("perfilAlumno", {
      style: "perfilAlumno.css",
      usuario: usuario,
      profesores: profesores,
      isProfesor: isProfesor,
      profesorDesignado: profesor,
      title: `Perfil ${usuario.nombre}  ${usuario.apellido}`,
    });
  } catch (error) {}
};

exports.perfilProfesor = async (req, res) => {
  let { pid } = req.params;
  try {
    let listaAlumnos = [];
    let alumnos = await userService.traeUsuarios();
    let profesor = await userService.traeUnProfesor(pid);
    for (let id of profesor.alumnos) {
      let alumno = await userService.traeUnUsuario(id);
      listaAlumnos.push(alumno);
    }
    res.render("perfilProfesor", {
      profesor: profesor,
      alumnos: listaAlumnos,
      style: "perfilProfesor.css",
      title: "Perfil",
    });
  } catch (error) {}
};

exports.panelAlumnos = async (req, res) => {
  let { uid } = req.params;
  let alumno = await userService.traeUnUsuario(uid);
  res.render("panelAlumnos", {
    alumno: alumno,
    style: "panelAlumno.css",
    title: "Panel Alumno",
  });
};

exports.login = async (req, res) => {
  if (!req.user)
    return res
      .status(400)
      .send({ status: "error", error: "Credenciales invalidas" });
  try {
    if (!req.user) return res.redirect("/login");
    if (req.user.rol === "alumno") {
      req.session.user = {
        id: req.user._id,
        nombre: req.user.nombre,
        apellido: req.user.apellido,
        email: req.user.email,
        cumpleanos: req.user.cumpleanos,
        fecha_registro: req.user.fecha_registro,
        profesor: req.user.profesor,
        rutinas: req.user.rutinas,
        rol: req.user.rol,
      };
      return res.redirect(`/api/users/perfil/${req.session.user.id}`);
    }
    if (req.user.rol === "profesor") {
      req.session.user = {
        id: req.user._id,
        nombre: req.user.nombre,
        apellido: req.user.apellido,
        email: req.user.email,
        cumpleanos: req.user.cumpleanos,
        fecha_registro: req.user.fecha_registro,
        alumnos: req.user.alumnos,
        rol: req.user.rol,
      };
      return res.redirect(`/api/users/perfil/profesor/${req.session.user.id}`);
    }
    // return res.send({ message: "Usted es administrador" });
  } catch (err) {
    res.status(500).send("Error al iniciar sesión");
  }
};

exports.rutina = async (req, res) => {
  res.render("confeccionRutinas");
};
// exports.crearUsuario = async (req, res) => {
//   let { nombre, apellido, email, password, cumpleanos } = req.body;
//   try {
//     let fechaActual = new Date();
//     let nuevoUsuario = {
//       nombre: nombre,
//       apellido: apellido,
//       email: email,
//       password: createHash(password),
//       cumpleanos: cumpleanos,
//       fecha_registro: fechaActual,
//     };

//     const result = await userService.crearUsuario(nuevoUsuario);

//     return result;
//   } catch (error) {
//     console.log(error);
//     res.json({ message: "No se puede crear usuario" });
//   }
// };

exports.cargarProfesor = async (req, res) => {
  let { uid, pid } = req.params;
  const baseUrl = `${req.protocol}://${req.headers.host}`;

  try {
    let alumno = await userService.traeUnUsuario(uid);
    let profesor = await userService.traeUnProfesor(pid);
    if (alumno.profesor === "") {
      let existeAlumno = profesor.alumnos.find((e) => e === uid);
      if (existeAlumno) {
        return res
          .status(401)
          .json({ message: "Ya existe alumno en lista del profesor" });
      }
    }
    await userService.cargarAlumnos(pid, uid);
    let result = await userService.actualizaPropiedad(uid, { profesor: pid });

    await transport.sendMail({
      from: "Shadow Fit <shadowfit.info@gmail.com",
      to: profesor.email,
      subject: `${profesor.nombre} tienes trabajo 💪`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <img style="width:100px;" src="https://firebasestorage.googleapis.com/v0/b/pfcantarin-reactjs.appspot.com/o/Artboard%201-8.png?alt=media&token=0e71c0ac-b657-45fe-95dd-394dea2eed3e" alt="">
      <h2>Hola ${profesor.nombre}</h2>
      <p>Tienes un alumno nuevo: ${alumno.apellido} ${alumno.nombre}</p>
      <a style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #9222ff; color: white; text-decoration: none; border-radius: 5px;" href="${baseUrl}/api/users/panelalumno/${alumno._id}">Ingresá y conocelo</a>
      </div>
      </div>`,
    });
    return res.status(200).json({ message: "Profesor agregado correctamente" });
  } catch (error) {
    console.log("Entro en el catch " + error);
  }
};

exports.cargarRutina = async (req, res) => {
  // app.post("/files", async (req, res) => {
  //   const prueba = "<h1>hola</h1>";
  //   const nombreArchivo = "pija2.pdf";
  //   const result = await crearPDF(prueba, nombreArchivo);
  //   await uploadFile(result, nombreArchivo);
  //   res.send({ message: "subida exitos" });
  // });
  const baseUrl = `${req.protocol}://${req.headers.host}`;
  let { uid } = req.params;
  let { rutina } = req.body;
  try {
    let alumno = await userService.traeUnUsuario(uid);
    rutina.nombreArchivo = `Rutina${alumno.rutinas.length + 1}-${
      alumno.apellido
    }.pdf`;

    let profesor = await userService.traeUnProfesor(alumno.profesor);
    const result = await crearPDF(rutina.vistaAlumno);
    await uploadFile(result, rutina.nombreArchivo, "application/pdf");
    await userService.cargarRutina(uid, rutina);
    const urlFile = await getFileURL(rutina.nombreArchivo);

    await transport.sendMail({
      from: "Shadow Fit <shadowfit.info@gmail.com",
      to: alumno.email,
      subject: `${alumno.nombre} tenés una nueva rutina nueva`,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <img style="width:100px;" src="https://firebasestorage.googleapis.com/v0/b/pfcantarin-reactjs.appspot.com/o/Artboard%201-8.png?alt=media&token=0e71c0ac-b657-45fe-95dd-394dea2eed3e" alt="">
      <h2>Hola ${alumno.nombre}</h2>
      <p>Tiene una rutina nueva de tu profesor ${profesor.nombre}</p>
      <a style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #9222ff; color: white; text-decoration: none; border-radius: 5px;" href="${baseUrl}/api/users/perfil/${alumno._id}">Ingresá y mirala</a>
      </div>
      </div>`,
    });

    return res
      .status(200)
      .json({ success: true, message: "Rutina agregada correctamente" });
  } catch (error) {
    console.log("Entro en el catch " + error);
  }
};

exports.files = async (req, res) => {
  const result = await getFiles();
  res.json(result.Contents);
};

exports.actualizarUsuario = async (req, res) => {
  let { uid } = req.params;
  let { nombre, apellido, email, compleanos } = req.body;
  let usuario = await userService.traeUnUsuario(uid);
  try {
    let usuarioActualizado = {
      _id: usuario._id,
      nombre: nombre || usuario.nombre,
      apellido: apellido || usuario.apellido,
      email: email || usuario.email,
      cumpleanos: usuario.cumpleanos,
      fecha_registro: usuario.fecha_registro,
      rol: usuario.rol,
    };
    let result = await userService.actualizaUsuario(uid, usuarioActualizado);
    res.send({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.json({ message: "Error al acualizar" });
  }
};

exports.cambiarContrasena = async (req, res) => {
  try {
    let { uid } = req.params;
    let { contrasenaActual, contrasenaNueva } = req.body;

    let alumno = await userService.traeUnUsuario(uid);

    if (!alumno) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (!isValidPassword(alumno, contrasenaActual)) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    //Hashear la nueva contraseña
    const newPassword = createHash(contrasenaNueva);

    //Actualizar la contraseña en la base de datos
    await userService.actualizaPropiedad(uid, { password: newPassword });
    res.json({ message: "Contraseña cambiada correctamente" });
  } catch (error) {
    console.error("Error al cambiar la contraseña: ", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
exports.cargarFotoPerfilAlumno = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await userService.traeUnUsuario(uid);
    if (!user) return res.status(404).send("Usuario no encontrado");
    if (!req.file) return res.status(400).send("No se recibió ninguna imagen.");
    nuevaPropiedad = {
      foto_perfil: req.file.key,
    };
    await userService.actualizaPropiedad(uid, nuevaPropiedad);
    res.redirect(`/api/users/perfil/${user._id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
exports.cargarFotoPerfilProfesor = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await userService.traeUnProfesor(uid);
    if (!user) return res.status(404).send("Usuario no encontrado");
    if (!req.file) return res.status(400).send("No se recibió ninguna imagen.");
    nuevaPropiedad = {
      foto_perfil: req.file.key,
    };

    await userService.actualizaPropiedadProfesor(uid, nuevaPropiedad);
    res.redirect(`/api/users/perfil/profesor/${user._id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.traerImagenPerfil = async (req, res) => {
  try {
    // Buscar al usuario por ID
    const user = await userService.traeUnUsuario(req.params.id);
    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).send("Usuario no encontrado.");
    }

    // Verificar si el usuario tiene una foto de perfil
    if (!user.foto_perfil) {
      return res.status(404).send("No hay foto de perfil disponible.");
    }

    const fileName = user.foto_perfil;
    const imagenURL = await getFileURL(fileName);

    res.json({ url: imagenURL });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
exports.traerImagenPerfilProfesor = async (req, res) => {
  try {
    // Buscar al usuario por ID
    const user = await userService.traeUnProfesor(req.params.id);
    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).send("Usuario no encontrado.");
    }

    // Verificar si el usuario tiene una foto de perfil
    if (!user.foto_perfil) {
      return res.status(404).send("No hay foto de perfil disponible.");
    }

    const fileName = user.foto_perfil;
    const imagenURL = await getFileURL(fileName);

    res.json({ url: imagenURL });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.subirProgresos = async (req, res) => {
  let { uid } = req.params;
  let { fechaProgreso } = req.body;
  const archivos = req.files;

  try {
    const fotoFrenteKey = archivos.fotoFrente
      ? archivos.fotoFrente[0].key
      : null;
    const fotoPerfilKey = archivos.fotoPerfil
      ? archivos.fotoPerfil[0].key
      : null;
    const fotoEspaldaKey = archivos.fotoEspalda
      ? archivos.fotoEspalda[0].key
      : null;

    const nuevoObjeto = {
      fecha: fechaProgreso,
      fotoFrente: fotoFrenteKey,
      fotoPerfil: fotoPerfilKey,
      fotoEspalda: fotoEspaldaKey,
    };

    await userService.cargarProgreso(uid, nuevoObjeto);
    return res
      .status(200)
      .json({ success: true, message: "Progresos cargados correctamente" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.traerFotoProgreso = async (req, res) => {
  let { uid, foto } = req.params;
  try {
    // Buscar al usuario por ID
    const user = await userService.traeUnUsuario(uid);
    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).send("Usuario no encontrado.");
    }

    // Verificar si el usuario tiene una foto de perfil
    if (user.progresos.length < 0) {
      return res.status(404).send("No hay progresos.");
    }

    const fileName = foto;
    const imagenURL = await getFileURL(fileName);

    res.json({ url: imagenURL });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
