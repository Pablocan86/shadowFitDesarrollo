const UserManager = require("../dao/classes/users.dao.js");
const puppeteer = require("puppeteer");
const { crearRutina } = require("../midlewars/descargarPDF.js");
const { transport } = require("../config/mailConfig.js");
const userService = new UserManager();
const { getFileURL } = require("../config/s3.js");

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
  res.render("rutina", {
    rutina: rutina,
    alumno,
    title: `Rutina de ${usuario.nombre} ${usuario.apellido}`,
  });
};

exports.rutinaProfesor = async (req, res) => {
  let { number, uid } = req.params;
  let usuario = await userService.traeUnUsuario(uid);

  let rutina = usuario.rutinas[number];
  res.render("rutina", {
    rutina: rutina,
    style: "rutina.css",
    title: `Rutina de ${usuario.nombre} ${usuario.apellido}`,
  });
};

exports.alumnoRegistrado = async (req, res) => {
  let alumno = req.user;
  await transport.sendMail({
    from: "Shadow Fit <shadowfit.info@gmail.com",
    to: alumno.email,
    subject: `${alumno.nombre} bienvenid@ a Shadow Fit`,
    html: `
    <img style="width:100px;" src="https://lh3.googleusercontent.com/fife/ALs6j_En-sagYX45iih9TLATxrOg0LIjlS3Jp6uMYTJtq2l5AbR29usbTMOVqTUb_X6pz_C9cxW1WU99MPvqQJwKYzt-m5TwFD_neto0EekM8bf-9RZ91Q6jiBuMSgh9-B8i9vh9_vSd4RcXoC5QiVG54KOz9Vp9wenzp1pV-UU5AB3pLQ-T7cgjT9lGQevpdqtrLWaneHZgbQKTwrwyk8SqYYlwJUCAjcOlAG7Ee0QKn6HmS0pZNHrY4LITZsQmDr7fQA24cnWClgljBNfeCrYrtYkXrDykO2o67X4pgbDx7s54WYL1LtEPML940AiYyqtSESrMHfCsB_2YX-DtWCNZnx0SJdIfaakuYmcah-FFVS6jDtqEDBhVPmTblPvEFsD7oy10_F84QMN-CJw-EJv3bGuAtx3nWXj04JjncyTcqcLefWfywm7PUKfbtVJqIedQ9jxOmc23FjB1e_xwyDmVyaARIp3a5YHSIHd8X9IUdrV5h_Ocp_hklROnAEBtd4JR4idZGJsIQ3poFNHYwqc0iifUPFd5gRq4sxLKUFOaP-KhZOaDCexW3L2eyeU_DR0EQQfjad3F2PGIrW3vBFUwbXda5j-4tcrwGDAfuy6HZ0dTYMJJ2ibT9AhZkIlt12QrlZjLGdh6nqmJTtBsW7Xxa_sgFoqxryjrZrjZVqYwd-yO9sBHKMHPqgsmbZzkYEtkF43lCbMiNjlprtFjppP2yJbdCam3eaNqDXHeC9Z49tk7C4Vch3B43YPztsSFd2H8xeKbbgkz-qEQdv8UWPw9c7B50TMRc6hhFOtscVU3IFViEyC_c-_MyBXpSFb4nOoSuZXJK6vWYKMZsO7YOtuaqAJkrJt_c1Sr_hevyFUJF3pq8PlduxE8_-CNJ4yLj9lnYPZn7MKcAp6Yta5Bb7V_x6Wcci14P9A9v8LSSwiOK9Ki6OkKG8s5-8_tAI_EIYjymrgsMsXwyVU-Gzj3mY7nPDKhlXwbgWupL6kyrNV0IjH0rKpjdCRBnc8pCRrO9jNh4SBNB_nrqsd74jYtxfVknEFu6_IaeVpRIOyoJkgv4LKQJePp2b9b8hsGc3iaeiO4az7KxmcSZ_Bh-tQPYUzuN8df1EB9bP5vCYabPwkgKGz5odEAL9ac1goaqaripVbiBpWXmehAxm2ptt8ATUCYne8Ox1y6hPpZEB56WvOzglrbWdMR0NY7UO1JWOTF521UXub5X0WtStn5XG7AUGHzBGZp8g-ypZyusYhq7rA-PpXHwDby4g0MfWduOpmUhx2muIx9r0aS4JYjSGFDGKPna3SJmuaYuHuL0BzPiEZqmIcNC5bl7DNCQDyDnecKp1RZ8wN5iMkkWuWkvGBvwKykw7-M7JdtLLNvM8G_4RrysUzut8R4A4WWCRi0lXuZ6izUbytmEmC9HDWk7JEsP1d9smf8ZJ6dgU-A3KYqX9KM6vkeA9iRBQyudhxwWZJPOqkC48NBk3g37nAEyl1SN1JYCy03PKmCRa_eWhoMDGEuOcsbhdI8LvMPK3wh2BCQDaB-YdAerB64tg-VmWnXQdBAb9ji8WOMTIfGpSRs7cON_-y174UYeRUSIrVYoI9nvyVh6IHAXvXEEqm1kTwrtJc=w1920-h889" alt="">
    <h2>Hola ${alumno.nombre}</h2>
    <p>Bienvenido, ¡¡vamos a hacer que esto suceda!!</p>
    <p>Te saluda el equipo de Shadow Fit</p>,`,
  });
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

exports.verRutina = async (req, res) => {
  const result = await getFileURL(req.params.name);
  // await decargar;
  res.redirect(result);
};

exports.createPDF = async (req, res) => {
  let { number, uid } = req.params;
  let user = await userService.traeUnUsuario(uid);
  let rutinaHtml = user.rutinas[number].vistaAlumno;

  try {
    // let pdf = await crearRutina(rutinaHtml);

    let pdf = await crearRutina(
      `http://localhost:8080/api/views/rutina/${number}/${uid}`
    );

    // let pdf = await crearRutina(url);

    // // Devolvver el response como PDF

    res.contentType("application/pdf");

    res.end(pdf);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).send("Error al generar el PDF");
  }
};

exports.cambioContrasena = async (req, res) => {
  let { uid } = req.params;
  let alumno = await userService.traeUnUsuario(uid);
  res.render("cambioContrasena", {
    usuario: alumno,
    style: "cambiarContrasena.css",
  });
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
