const { Router } = require("express");
const userController = require("../controllers/userController.js");
const { isAuthenticated, isNotAuthenticated } = require("../midlewars/auth.js");
const upload = require("../midlewars/multer.js");
const router = Router();

router.get("/", userController.traeUsuarios);

router.get("/perfil/:uid", isAuthenticated, userController.perfilAlumno);

router.get(
  "/perfil/profesor/:pid",
  isAuthenticated,
  userController.perfilProfesor
);

router.get("/panelalumno/:uid", isAuthenticated, userController.panelAlumnos);

// router.post("/", userController.crearUsuario);

// router.post("/login", userController.loguin);

router.put("/:uid", userController.actualizarUsuario);

router.put("/cargarprofesor/:uid/:pid", userController.cargarProfesor);

router.put("/cargarrutina/:uid", userController.cargarRutina);

router.post(
  "/cargar-foto-perfil-alumno/:uid",
  upload.single("fotoPerfil"),
  userController.cargarFotoPerfilAlumno
);
router.post(
  "/cargar-foto-perfil-profesor/:uid",
  upload.single("fotoPerfil"),
  userController.cargarFotoPerfilProfesor
);

// Ruta para servir la foto de perfil desde MongoDB
router.get("/ver-foto-perfil-alumno/:id", userController.traerImagenPerfil);

router.get(
  "/ver-foto-perfil-profesor/:id",
  userController.traerImagenPerfilProfesor
);

// router.post(
//   "/cargar-foto-perfil-profesor/:uid",
//   upload.single("foto_perfil"),
//   userController.cargarFotoPerfilProfesor
// );
module.exports = router;
