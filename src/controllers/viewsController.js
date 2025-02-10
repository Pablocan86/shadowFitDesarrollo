const UserManager = require("../dao/classes/users.dao.js");
const puppeteer = require("puppeteer");
const { crearRutina } = require("../midlewars/descargarPDF.js");

const userService = new UserManager();

exports.home = async (req, res) => {
  if (!req.session.user) {
    return res.render("home", { style: "home.css", title: "Página principal" });
  }
  if (req.session.user.rol === "alumno") {
    let alumno = req.session.user;
    return res.render("home", {
      alumno: alumno,
      session: req.session.user,
      style: "home.css",
      title: "Página principal",
    });
  }
  if (req.session.user.rol === "profesor") {
    let profesor = req.session.user;
    return res.render("home", {
      profesor: profesor,
      session: req.session.user,
      style: "home.css",
      title: "Página principal",
    });
  }
};

exports.confeccionRutinas = async (req, res) => {
  let { uid } = req.params;

  let alumno = await userService.traeUnUsuario(uid);
  let profesor = await userService.traeUnProfesor(alumno.profesor);
  res.render("confeccionRutinas", {
    style: "confeccionRutinas.css",
    alumno: alumno,
    profesor: profesor,
  });
};

exports.rutina = async (req, res) => {
  let { number, uid } = req.params;
  let usuario = await userService.traeUnUsuario(uid);
  let alumno = true;
  let rutina = usuario.rutinas[number];
  res.render("rutina", { rutina: rutina, alumno });
};

exports.rutinaProfesor = async (req, res) => {
  let { number, uid } = req.params;
  let usuario = await userService.traeUnUsuario(uid);

  let rutina = usuario.rutinas[number];
  res.render("rutina", { rutina: rutina });
};

exports.alumnoRegistrado = async (req, res) => {
  res.render("register", {
    style: "registro.css",
    title: "Registro Alumnos",
    message: "Registro exitoso",
  });
};

exports.profesorRegistrado = async (req, res) => {
  res.render("registroProfesores", {
    style: "registroProfesores.css",
    title: "Registro Profesores",
    message: "Registro exitoso",
  });
};

exports.rutinaAlumno = async (req, res) => {
  let { number, uid } = req.params;
  let usuario = await userService.traeUnUsuario(uid);
  let rutina = usuario.rutinas[number].vistaAlumno;
  res.render("rutina", { layout: "rutinapdf", rutina: rutina });
};

exports.createPDF = async (req, res) => {
  let { number, uid } = req.params;
  let user = await userService.traeUnUsuario(uid);
  let rutinaHtml = user.rutinas[number].vistaAlumno;

  try {
    // //Crear la rutina
    let pdf = await crearRutina(
      `http://localhost:8080/api/views/rutina/${number}/${uid}`
    );

    // // Devolvver el response como PDF

    res.contentType("application/pdf");

    res.end(pdf);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).send("Error al generar el PDF");
  }
};

// exports.createPDF = async (req, res) => {
//   const { html } = req.body; // HTML enviado desde el cliente

//   if (!html) {
//     return res.status(400).send("No se envió contenido HTML");
//   }

//   try {
//     // Inicia Puppeteer
//     const browser = await puppeteer.launch({
//       headless: true,
//       defaultViewport: {
//         width: 750,
//         height: 500,
//         deviceScaleFactor: 1,
//         isMobile: true,
//         hasTouch: false,
//         isLandscape: false,
//       },
//     });
//     const page = await browser.newPage();

//     // Carga el contenido HTML en la página
//     await page.setContent(html, { waitUntil: "load" });

//     // Genera el PDF
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: { left: "0.5cm", top: "2cm", right: "0.5cm", bottom: "2cm" }, // Incluye estilos CSS
//     });

//     // Cierra el navegador
//     await browser.close();

//     // Devuelve el PDF al cliente
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", 'attachment; filename="page.pdf"');
//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error("Error al generar el PDF:", error);
//     res.status(500).send("Error interno al generar el PDF");
//   }
// };
