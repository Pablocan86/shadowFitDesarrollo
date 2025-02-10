const express = require("express");
const passport = require("passport");
const userController = require("../../controllers/userController.js");
const sessionController = require("../../controllers/sessionController.js");
const viewController = require("../../controllers/viewsController.js");
const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../../midlewars/auth.js");
const router = express.Router();

router.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "alumnoregistrado",
    failureRedirect: "fallo",
    failureMessage: true,
  })
);

router.post(
  "/registroprofesores",
  passport.authenticate("registerProfesor", {
    successRedirect: "profesorregistrado",
    failureRedirect: "fallo",
    failureMessage: true,
  })
);

router.get("/alumnoregistrado", viewController.alumnoRegistrado);

router.get("/profesorregistrado", viewController.profesorRegistrado);

router.get("/fallo", (req, res) => {
  res.send("Fallo");
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "home",
    failureRedirect: "failureLogin",
  })
);

router.post(
  "/loginprofesores",
  passport.authenticate("loginProfesor", {
    successRedirect: "home",
    failureRedirect: "failureLoginProfesor",
  })
);

router.get("/home", userController.login);

router.get("/failureLogin", (req, res) => {
  res.render("login", {
    error: "Valores incorrectos",
    style: "login.css",
    title: "Login Alumnos",
  });
});

router.get("/failureLoginProfesor", (req, res) => {
  res.render("loginProfesores", {
    error: "Usuario y/o contraseña incorrectos",
    style: "loginProfesores.css",
    title: "Ingreso profesores",
  });
});

router.post("/logout", sessionController.logout);

module.exports = router;
