const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
//Modulo de conexion a directorio activo
const ActiveDirectory = require("activedirectory2").promiseWrapper;
const pool = require("../database");
const helpers = require("./helpers");
const keys = require("../keys");
var os = require("os");

// Test Local Login
passport.use(
  "local.Login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      console.log("ACA");
      console.log(req.body);
      const rows = await pool.query(
        "SELECT * FROM users WHERE USU_USUARIO =?",
        [username]
      );
      if (rows.length > 0) {
        const user = rows[0];        
        const validPassword = await helpers.matchPassword(
          password,
          user.USU_PASSWORD
        );
        console.log(validPassword);
        if (validPassword) {
          console.log("Valido");
          done(
            null,
            user,
            req.flash("success", "Bienvenido " + user.USU_USUARIO)
          );
        } else {
          console.log("No Valido");
          done(
            null,
            user,
            req.flash("success", "Bienvenido " + user.USU_USUARIO)
          );
        }
      } else {
        return done(
          null,
          false,
          req.flash("message", "El usuario ingresado no existe")
        );
      }
    }
  )
);

//Test Local Registro
passport.use(
  "local.Registro",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const {
        documento,
        fullname,
        logincms,
        area_gestion,
        rol,
        aliado,
        estado,
        cargo,
        responsable_gestion,
      } = req.body;
      var newUser = {
        USU_DOCUMENTO: documento,
        USU_NOMBRES_APELLIDOS: fullname,
        USU_LOGINCMS: logincms,
        USU_USUARIO: username,
        USU_PASSWORD: password,
        USU_ROL: area_gestion,
        USU_ROL: rol,
        USU_ALIADO: aliado,
        USU_ESTADO: estado,
        USU_CARGO: cargo,
        USU_RESPONSABLE_GESTION: responsable_gestion,
      };
      newUser.USU_PASSWORD = await helpers.encryptPassword(password);
      const result = await pool.query("INSERT INTO users set ?", [newUser]);
      newUser.id = result.insertId;
      return done(null, newUser);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  done(null, user);
});
