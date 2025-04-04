const { Router } = require("express");
const userController = require("../controllers/userController.js");
const { isAuthenticated, isNotAuthenticated } = require("../midlewars/auth.js");
const { upload, upload2 } = require("../midlewars/multer.js");
const router = Router();

router.get("/", userController.traeUsuarios);

router.get("/confirm/:token", userController.confirm);

router.get("/perfil/:uid", isAuthenticated, userController.perfilAlumno);

router.get(
  "/perfil/profesor/:pid",
  isAuthenticated,
  userController.perfilProfesor
);

router.get("/panelalumno/:uid", isAuthenticated, userController.panelAlumnos);

// router.post("/", userController.crearUsuario);

// router.post("/login", userController.loguin);

// router.put("/:uid", userController.actualizarUsuario);

router.put("/cargarprofesor/:uid/:pid", userController.cargarProfesor);

router.put("/cargarrutina/:uid", userController.cargarRutina);

router.get("/files", userController.files);

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

router.put("/cambiarcontrasena/:uid", userController.cambiarContrasena);

router.put(
  "/subirprogresos/:uid",
  upload2.fields([
    { name: "fotoFrente", maxCount: 1 },
    { name: "fotoPerfil", maxCount: 1 },
    { name: "fotoEspalda", maxCount: 1 },
  ]),
  userController.subirProgresos
);

router.get("/fotoprogreso/:uid/:foto/", userController.traerFotoProgreso);

// router.get("/upload", userController.upload);

// router.post(
//   "/cargar-foto-perfil-profesor/:uid",
//   upload.single("foto_perfil"),
//   userController.cargarFotoPerfilProfesor
// );
module.exports = router;
