const express = require("express");
const router = express.Router();

const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

/* Modificar Inventario */
router.post("/AprobarVenta/:id", async (req, res) => {
  const { id } = req.params;
  const { MetodoPago, Aprobado } = req.body;
  console.log(req.body);
  const newUser = {
    PAGO: MetodoPago,
    ESTADO: Aprobado,
    ESTADO_VENTA: "Inactivo",
  };
  await pool.query("UPDATE ventas set ? WHERE PK_ID_VENT = ?", [newUser, [id]]);
  req.flash("success", "Usuario Actualizado Correctamente!!!");
  res.redirect("/Inventario");
});

module.exports = router;
