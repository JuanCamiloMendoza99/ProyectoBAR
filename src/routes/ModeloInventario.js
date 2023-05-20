const express = require("express");
const router = express.Router();

const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

/* Ingresar Inventario */
router.post("/RegistarInventario", async (req, res) => {
  const {
    cantidad,
    nombre,
    precio,
    estado,
    ubicacion,
    cargo,
    responsable_gestion,
  } = req.body;
  console.log(req.body);
  const newUser = {
    CANTIDAD: cantidad,
    NOMBRE: nombre,
    PRECIO: precio,
    ESTADO: estado,
    UBICACION: ubicacion,
    CARGO: cargo,
    RESPONSABLE: responsable_gestion,
  };
  console.log(newUser);
  await pool.query("INSERT INTO inventario set ?", [newUser]);
  req.flash("success", "Usuario Registrado Correctamente!!!");
  res.redirect("/InventarioMain");
});

/* Modificar Inventario */
router.post("/ActualizarInventario/:id", async (req, res) => {
  const { id } = req.params;
  const { cantidad, nombre, precio, estado, ubicacion } = req.body;
  console.log(req.body);
  const newUser = {
    CANTIDAD: cantidad,
    NOMBRE: nombre,
    PRECIO: precio,
    ESTADO: estado,
    UBICACION: ubicacion,
  };
  await pool.query("UPDATE inventario set ? WHERE PK_ID_INVE = ?", [
    newUser,
    [id],
  ]);
  req.flash("success", "Usuario Actualizado Correctamente!!!");
  res.redirect("/Inventario");
});

module.exports = router;
