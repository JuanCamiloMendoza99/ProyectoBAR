const express = require("express");
const router = express.Router();
const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

/* Modificar Inventario */
router.post("/ModificarVenta/:id", async (req, res) => {
  const { id } = req.params;
  let { valores, nombres, mesa } = req.body;
  //   console.log(req.body);
  //   console.log(nombres);

  var resultado = nombres.split(" - ").map(function (item) {
    var partes = item.split(": ");
    return {
      NOMBRE: partes[0],
      CANTIDAD: parseInt(partes[1]),
    };
  });

  var ArrayCantidad = [];
  var objetoJSON = {};

  // Recorrer cada objeto y realizar la búsqueda en MySQL
  for (var i = 0; i < resultado.length; i++) {
    var objeto = resultado[i];
    var nombre = objeto.NOMBRE;
    var cantidad = objeto.CANTIDAD;
    var cantidadTotal = 0;
    var sql = `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario WHERE NOMBRE = '${nombre}'`;
    var dataActual = await pool.query(sql);

    dataActual.forEach(function (objeto) {
      var pk = objeto.PK_ID_INVE.toString();
      var cantidad2 = cantidad;
      objetoJSON[pk] = cantidad2;
    });

    // console.log(dataActual);
    // console.log(cantidad);
    // console.log(dataActual[0].PRECIO);
    cantidadTotal = dataActual[0].PRECIO * cantidad;
    // console.log(cantidadTotal);
    ArrayCantidad.push(cantidadTotal);
  }

  var jsonString = JSON.stringify(objetoJSON);

  console.log(jsonString);

  //   console.log("ArrayCantidad");
  //   console.log(ArrayCantidad);

  var suma = ArrayCantidad.reduce(function (total, valor) {
    return total + valor;
  }, 0);

  console.log(suma);

  const newVenta = {
    PRECIO: suma,
    VALORES: jsonString,
    MESA: mesa,
  };
  await pool.query("UPDATE ventas set ? WHERE PK_ID_VENT = ?", [
    newVenta,
    [id],
  ]);
  req.flash("success", "Usuario Actualizado Correctamente!!!");
  res.redirect("/HistorialVenta");
});

module.exports = router;

// {NOMBRE: "GASEOSA 1.5L", CANTIDAD: 3}
// {NOMBRE:"CARNE DE RES", CANTIDAD: 2}
// {NOMBRE:"CERVEZA POKER", CANTIDAD: 2}
