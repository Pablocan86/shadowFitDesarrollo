const passport = require("passport");
const local = require("passport-local");
const UserManager = require("../dao/classes/users.dao.js");
const { createHash, isValidPassword } = require("../utils.js");
const { v4: uuidv4 } = require("uuid");
const { getToken, getTokenData } = require("./jwt.config.js");

const userService = new UserManager();

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
      },
      async (req, username, password, done) => {
        const { nombre, apellido, email, telefono, cumpleanos } = req.body;

        try {
          let user = await userService.traeUnUsuarioEmail(username);
          if (user) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          //Generar código

          const code = uuidv4();

          // Formateo fecha actual
          let fechaActual = new Date().toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });

          // const fechaFormateada = fechaActual.toLocalDateString("es-Es", {
          //   day: "2-digit",
          //   month: "long",
          //   year: "numeric",
          // });

          const nuevoUsuario = {
            nombre,
            apellido,
            email,
            telefono,
            password: createHash(password),
            cumpleanos,
            foto_perfil: null,
            code: code,
            fecha_registro: fechaActual,
          };

          let result = await userService.crearUsuario(nuevoUsuario);

          //Obtener un template

          return done(null, result);
        } catch (error) {
          return done(error, false, { message: "Error en el registro" });
        }
      }
    )
  );
  passport.use(
    "registerProfesor",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
      },
      async (req, username, password, done) => {
        const { nombre, apellido, email, telefono, cumpleanos } = req.body;

        try {
          let user = await userService.traeUnProfesorEmail(username);
          if (user) {
            return done(null, false, { message: "El profesor ya existe" });
          }
          let fechaActual = new Date();

          const nuevoUsuario = {
            nombre,
            apellido,
            email,
            telefono,
            password: createHash(password),
            cumpleanos,
            fecha_registro: fechaActual,
          };

          let result = await userService.crearProfesor(nuevoUsuario);
          return done(null, result);
        } catch (error) {
          return done(error, false, { message: "Error en el registro" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // passport.deserializeUser(async (id, done) => {
  //   let user;
  //   let profesor = await userService.traeUnProfesor(id);
  //   let alumno = await userService.traeUnUsuario(id);
  //   if (profesor) {
  //     user = profesor;
  //   }
  //   if (alumno) {
  //     user = alumno;
  //   }

  //   done(null, user);
  // });

  //Corrección CHATGPT

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userService.traeUnUsuario(id);
      if (!user) {
        user = await userService.traeUnProfesor(id);
      }
      return done(null, user || false);
    } catch (error) {
      return done(error);
    }
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const usuario = await userService.traeUnUsuarioEmail(username);
          if (!usuario) {
            console.log("Usuario no existe");
            return done(null, usuario);
          }
          if (!isValidPassword(usuario, password)) return done(null, false);
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "loginProfesor",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const usuario = await userService.traeUnProfesorEmail(username);
          if (!usuario) {
            console.log("Usuario no existe");
            return done(null, usuario);
          }
          if (!isValidPassword(usuario, password)) return done(null, false);
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
