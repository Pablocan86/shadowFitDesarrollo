const UserManager = require("../dao/classes/users.dao.js");
const { createHash, isValidPassword } = require("../utils.js");
const { Buffer } = require("buffer");
const userService = new UserManager();
const { transport } = require("../config/mailConfig.js");
const { getFiles, uploadFile } = require("../config/s3.js");
const { crearPDF } = require("../midlewars/descargarPDF.js");

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
      <img style="width:100px;" src="https://lh3.googleusercontent.com/fife/ALs6j_En-sagYX45iih9TLATxrOg0LIjlS3Jp6uMYTJtq2l5AbR29usbTMOVqTUb_X6pz_C9cxW1WU99MPvqQJwKYzt-m5TwFD_neto0EekM8bf-9RZ91Q6jiBuMSgh9-B8i9vh9_vSd4RcXoC5QiVG54KOz9Vp9wenzp1pV-UU5AB3pLQ-T7cgjT9lGQevpdqtrLWaneHZgbQKTwrwyk8SqYYlwJUCAjcOlAG7Ee0QKn6HmS0pZNHrY4LITZsQmDr7fQA24cnWClgljBNfeCrYrtYkXrDykO2o67X4pgbDx7s54WYL1LtEPML940AiYyqtSESrMHfCsB_2YX-DtWCNZnx0SJdIfaakuYmcah-FFVS6jDtqEDBhVPmTblPvEFsD7oy10_F84QMN-CJw-EJv3bGuAtx3nWXj04JjncyTcqcLefWfywm7PUKfbtVJqIedQ9jxOmc23FjB1e_xwyDmVyaARIp3a5YHSIHd8X9IUdrV5h_Ocp_hklROnAEBtd4JR4idZGJsIQ3poFNHYwqc0iifUPFd5gRq4sxLKUFOaP-KhZOaDCexW3L2eyeU_DR0EQQfjad3F2PGIrW3vBFUwbXda5j-4tcrwGDAfuy6HZ0dTYMJJ2ibT9AhZkIlt12QrlZjLGdh6nqmJTtBsW7Xxa_sgFoqxryjrZrjZVqYwd-yO9sBHKMHPqgsmbZzkYEtkF43lCbMiNjlprtFjppP2yJbdCam3eaNqDXHeC9Z49tk7C4Vch3B43YPztsSFd2H8xeKbbgkz-qEQdv8UWPw9c7B50TMRc6hhFOtscVU3IFViEyC_c-_MyBXpSFb4nOoSuZXJK6vWYKMZsO7YOtuaqAJkrJt_c1Sr_hevyFUJF3pq8PlduxE8_-CNJ4yLj9lnYPZn7MKcAp6Yta5Bb7V_x6Wcci14P9A9v8LSSwiOK9Ki6OkKG8s5-8_tAI_EIYjymrgsMsXwyVU-Gzj3mY7nPDKhlXwbgWupL6kyrNV0IjH0rKpjdCRBnc8pCRrO9jNh4SBNB_nrqsd74jYtxfVknEFu6_IaeVpRIOyoJkgv4LKQJePp2b9b8hsGc3iaeiO4az7KxmcSZ_Bh-tQPYUzuN8df1EB9bP5vCYabPwkgKGz5odEAL9ac1goaqaripVbiBpWXmehAxm2ptt8ATUCYne8Ox1y6hPpZEB56WvOzglrbWdMR0NY7UO1JWOTF521UXub5X0WtStn5XG7AUGHzBGZp8g-ypZyusYhq7rA-PpXHwDby4g0MfWduOpmUhx2muIx9r0aS4JYjSGFDGKPna3SJmuaYuHuL0BzPiEZqmIcNC5bl7DNCQDyDnecKp1RZ8wN5iMkkWuWkvGBvwKykw7-M7JdtLLNvM8G_4RrysUzut8R4A4WWCRi0lXuZ6izUbytmEmC9HDWk7JEsP1d9smf8ZJ6dgU-A3KYqX9KM6vkeA9iRBQyudhxwWZJPOqkC48NBk3g37nAEyl1SN1JYCy03PKmCRa_eWhoMDGEuOcsbhdI8LvMPK3wh2BCQDaB-YdAerB64tg-VmWnXQdBAb9ji8WOMTIfGpSRs7cON_-y174UYeRUSIrVYoI9nvyVh6IHAXvXEEqm1kTwrtJc=w1920-h889" alt="">
      <h2>Hola ${profesor.nombre}</h2>
      <p>Tienes un alumno nuevo: ${alumno.apellido} ${alumno.nombre}</p>
      <a href="http://192.168.0.250:8080/api/users/panelalumno/${alumno._id}">Ingresá y conocelo</a>`,
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
  let { uid } = req.params;
  let { rutina } = req.body;
  try {
    let alumno = await userService.traeUnUsuario(uid);
    rutina.nombreArchivo = `Rutina${alumno.rutinas.length + 1}-${
      alumno.apellido
    }.pdf`;

    let profesor = await userService.traeUnProfesor(alumno.profesor);
    const result = await crearPDF(rutina.vistaAlumno);
    await uploadFile(result, rutina.nombreArchivo);
    await userService.cargarRutina(uid, rutina);

    await transport.sendMail({
      from: "Shadow Fit <shadowfit.info@gmail.com",
      to: alumno.email,
      subject: "Usted tiene una nueva rutina disponible",
      html: `<img style="width:100px;" src="https://lh3.googleusercontent.com/fife/ALs6j_En-sagYX45iih9TLATxrOg0LIjlS3Jp6uMYTJtq2l5AbR29usbTMOVqTUb_X6pz_C9cxW1WU99MPvqQJwKYzt-m5TwFD_neto0EekM8bf-9RZ91Q6jiBuMSgh9-B8i9vh9_vSd4RcXoC5QiVG54KOz9Vp9wenzp1pV-UU5AB3pLQ-T7cgjT9lGQevpdqtrLWaneHZgbQKTwrwyk8SqYYlwJUCAjcOlAG7Ee0QKn6HmS0pZNHrY4LITZsQmDr7fQA24cnWClgljBNfeCrYrtYkXrDykO2o67X4pgbDx7s54WYL1LtEPML940AiYyqtSESrMHfCsB_2YX-DtWCNZnx0SJdIfaakuYmcah-FFVS6jDtqEDBhVPmTblPvEFsD7oy10_F84QMN-CJw-EJv3bGuAtx3nWXj04JjncyTcqcLefWfywm7PUKfbtVJqIedQ9jxOmc23FjB1e_xwyDmVyaARIp3a5YHSIHd8X9IUdrV5h_Ocp_hklROnAEBtd4JR4idZGJsIQ3poFNHYwqc0iifUPFd5gRq4sxLKUFOaP-KhZOaDCexW3L2eyeU_DR0EQQfjad3F2PGIrW3vBFUwbXda5j-4tcrwGDAfuy6HZ0dTYMJJ2ibT9AhZkIlt12QrlZjLGdh6nqmJTtBsW7Xxa_sgFoqxryjrZrjZVqYwd-yO9sBHKMHPqgsmbZzkYEtkF43lCbMiNjlprtFjppP2yJbdCam3eaNqDXHeC9Z49tk7C4Vch3B43YPztsSFd2H8xeKbbgkz-qEQdv8UWPw9c7B50TMRc6hhFOtscVU3IFViEyC_c-_MyBXpSFb4nOoSuZXJK6vWYKMZsO7YOtuaqAJkrJt_c1Sr_hevyFUJF3pq8PlduxE8_-CNJ4yLj9lnYPZn7MKcAp6Yta5Bb7V_x6Wcci14P9A9v8LSSwiOK9Ki6OkKG8s5-8_tAI_EIYjymrgsMsXwyVU-Gzj3mY7nPDKhlXwbgWupL6kyrNV0IjH0rKpjdCRBnc8pCRrO9jNh4SBNB_nrqsd74jYtxfVknEFu6_IaeVpRIOyoJkgv4LKQJePp2b9b8hsGc3iaeiO4az7KxmcSZ_Bh-tQPYUzuN8df1EB9bP5vCYabPwkgKGz5odEAL9ac1goaqaripVbiBpWXmehAxm2ptt8ATUCYne8Ox1y6hPpZEB56WvOzglrbWdMR0NY7UO1JWOTF521UXub5X0WtStn5XG7AUGHzBGZp8g-ypZyusYhq7rA-PpXHwDby4g0MfWduOpmUhx2muIx9r0aS4JYjSGFDGKPna3SJmuaYuHuL0BzPiEZqmIcNC5bl7DNCQDyDnecKp1RZ8wN5iMkkWuWkvGBvwKykw7-M7JdtLLNvM8G_4RrysUzut8R4A4WWCRi0lXuZ6izUbytmEmC9HDWk7JEsP1d9smf8ZJ6dgU-A3KYqX9KM6vkeA9iRBQyudhxwWZJPOqkC48NBk3g37nAEyl1SN1JYCy03PKmCRa_eWhoMDGEuOcsbhdI8LvMPK3wh2BCQDaB-YdAerB64tg-VmWnXQdBAb9ji8WOMTIfGpSRs7cON_-y174UYeRUSIrVYoI9nvyVh6IHAXvXEEqm1kTwrtJc=w1920-h889" alt="">
      // <h2>Hola ${alumno.nombre}</h2>
      //<p>Tu profesor ${profesor.nombre} te acaba de hacer una rutina</p>
      //<a href="http://api/users/perfil/${alumno._id}">Mirala desde aquí</a>`,
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
    nuevaPropiedad = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await userService.actualizaPropiedad(uid, { foto_perfil: nuevaPropiedad });
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
    nuevaPropiedad = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await userService.actualizaPropiedadProfesor(uid, {
      foto_perfil: nuevaPropiedad,
    });
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
    if (!user.foto_perfil || !user.foto_perfil.data) {
      return res.status(404).send("No hay foto de perfil disponible.");
    }

    const imagenBuffer = Buffer.from(
      user.foto_perfil.data.buffer || user.foto_perfil.data,
      "base64"
    );

    // Configurar el tipo de contenido correcto según el MIME tipo
    res.set("Content-Type", user.foto_perfil.contentType);

    // Enviar la imagen (buffer) como respuesta
    res.send(imagenBuffer);
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
    if (!user.foto_perfil || !user.foto_perfil.data) {
      return res.status(404).send("No hay foto de perfil disponible.");
    }

    const imagenBuffer = Buffer.from(
      user.foto_perfil.data.buffer || user.foto_perfil.data,
      "base64"
    );

    // Configurar el tipo de contenido correcto según el MIME tipo
    res.set("Content-Type", user.foto_perfil.contentType);

    // Enviar la imagen (buffer) como respuesta
    res.send(imagenBuffer);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
