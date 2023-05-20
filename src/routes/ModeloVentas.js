const express = require("express");
const router = express.Router();

const pool = require("../database");
const { isLoggedIn } = require("../lib/auth");

/* Ingresar Inventario */
router.post("/consultarInventarioVentas", async (req, res) => {
  const sede = req.body.sede;
  const sql = `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario WHERE ESTADO = 'Activo' AND UBICACION = '${sede}'`;

  const dataReportingGestionSAC = await pool.query(sql);
  console.log(dataReportingGestionSAC);
  res.json(dataReportingGestionSAC);
});

router.post("/generarCompra", async (req, res) => {
  var contador = {};
  carrito = req.body.carrito;
  total = req.body.total;
  Mesa = req.body.Mesa;

  for (var i = 0; i < carrito.length; i++) {
    var elemento = carrito[i];

    if (contador[elemento]) {
      contador[elemento]++;
    } else {
      contador[elemento] = 1;
    }
  }

  const objetosVendidos = JSON.stringify(contador);

  // Mostrar los resultados
  for (var key in contador) {
    console.log("El valor " + key + " se repite " + contador[key] + " veces");

    const sql1 = `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario WHERE PK_ID_INVE = '${key}'`;

    const CantidadActual = await pool.query(sql1);

    if (CantidadActual[0].CANTIDAD < contador[key]) {
      console.log(
        "No hay suficiente cantidad de " +
          CantidadActual[0].NOMBRE +
          " para realizar la compra"
      );
      res.json({
        success: false,
        message:
          "No hay suficiente cantidad de " +
          CantidadActual[0].NOMBRE +
          " para realizar la compra ",
      });
      return;
    } else {
      const sql2 = `UPDATE ${bdd_name}.inventario SET CANTIDAD = CANTIDAD - ${contador[key]} WHERE PK_ID_INVE = '${key}'`;
      await pool.query(sql2);
    }
  }

  const sql = `INSERT INTO ${bdd_name}.ventas (PRECIO , VALORES, MESA, VENDEDOR , SEDE , ESTADO_VENTA) VALUES ('${total}' , '${objetosVendidos}' ,'${Mesa}' ,'${req.user.USU_NOMBRES_APELLIDOS}' , '${req.user.USU_SEDE}' , 'Activo')`;
  console.log(sql);
  await pool.query(sql);
  res.json({ success: true, message: "La venta se realizó correctamente." });
});

module.exports = router;

// [
//     RowDataPacket {
//         NOMBRE: 'CERVEZA POKER',
//         PRECIO: '3000',

//     }
// ]
// [
//     RowDataPacket {
//         NOMBRE: 'CERVEZA POKER',
//         PRECIO: '3000',

//     }
// ]
