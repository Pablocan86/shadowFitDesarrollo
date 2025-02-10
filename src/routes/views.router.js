const { Router } = require("express");
const viewsController = require("../controllers/viewsController.js");
const {
  isAuthenticated,
  isNotAuthenticated,
  isNotAuthenticatedProfesor,
} = require("../midlewars/auth.js");
const router = Router();

router.get("/chat", (req, res) => {
  res.render("chat", { title: "chat" });
});

router.get("/paginaprincipal", viewsController.home);

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login", { style: "login.css", title: "Login Alumnos" });
});

router.get(
  "/confeccionrutinas/:uid",
  isAuthenticated,
  viewsController.confeccionRutinas
);

router.get("/rutina/:number/:uid", viewsController.rutina);
router.get("/rutinaProfesor/:number/:uid", viewsController.rutinaProfesor);

router.get("/createPDF/:number/:uid", viewsController.createPDF);

router.get("/loginprofesores", isNotAuthenticatedProfesor, (req, res) => {
  res.render("loginProfesores", {
    style: "loginProfesores.css",
    title: "Ingreso profesores",
  });
});

router.get("/registro", (req, res) => {
  res.render("register", { style: "registro.css", title: "Registro Alumnos" });
});

router.get("/registroprofesores", (req, res) => {
  res.render("registroProfesores", {
    style: "registroProfesores.css",
    title: "Registro Profesores",
  });
});

router.get("/", (req, res) => {
  res.send({ message: "Pantalla inicio" });
});

module.exports = router;
