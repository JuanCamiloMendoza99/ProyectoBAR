const express = require("express");
const router = express.Router();
const passport = require("passport");
const { userInfo } = require("os");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

router.get("/Registro", isNotLoggedIn, (req, res) => {
  /* res.sendFile(path.join(__dirname, '../views/auth/Registro.html')); */
  res.render("auth/Registro");
});

router.post(
  "/Registro",
  passport.authenticate("local.Registro", {
    successRedirect: "/redirect",
    failureRedirect: "/Registro",
    failureFlash: true,
  })
);

router.get("/Login", isNotLoggedIn, (req, res) => {
  res.render("auth/Login");
});

router.post("/Login", (req, res, next) => {
  console.log("LOGINNNNNN")
  passport.authenticate("local.Login", {
    successRedirect: "/estado",
    failureRedirect: "/Login",
    failureFlash: true,
  })(req, res, next);
});

/* Vista Estado Usuario - Roles js */
router.get("/estado", (req, res, next) => {
  console.log("LOGINNNNNNN")
  try {
    if (req.user.USU_ESTADO === "Activo") {
      res.redirect("/redirect");
    }
    if (req.user.USU_ESTADO === "Inactivo") {
      req.flash(
        "message",
        "El usuario ingresado se encuentra inactivo en la base de datos !!!"
      );
      res.redirect("/logout");
      console.log(
        "El usuario ingresado se encuentra inactivo en la base de datos !!!"
      );
    }
  } catch (error) {
    res.render("404");
  }
});

/* Vista Area Gestión - Roles js */
router.get("/redirect", isLoggedIn, (req, res, next) => {
  try {
    if (req.user.USU_ROL == "Agente") {
      res.redirect("/gestionAsesor");
    } else if (req.user.USU_ROL == "Supervisor") {
      res.redirect("/reportingSupervisor");
    } else if (req.user.USU_ROL == "Administrador") {
      res.redirect("/adminusuariosAdmin");
    } else {
      res.render("401");
      console.log("Usuario sin area de gestión asignada");
    }
  } catch (error) {
    res.render("404");
  }
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log("❌ ~ file: routes/authentication.js ~ Error:", err);
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
