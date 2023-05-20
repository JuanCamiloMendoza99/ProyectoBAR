const express = require("express");
const router = express.Router();
const passport = require("passport");
const pool = require("../database");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

router.get("/Inventario", isLoggedIn, async (req, res) => {
  try {
    if (req.user.USU_ROL == "Administrador") {
      const listaInventarioMain = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario`
      );
      const TipoInventario = "Maestro";
      res.render("InventarioMain", {
        TipoInventario: TipoInventario,
        listaInventarioMain: listaInventarioMain,
      });
      console.log(listaInventarioMain);
    } else if (req.user.USU_ROL == "Cajero") {
      const listaInventarioMain = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario WHERE UBICACION = "${req.user.USU_SEDE}"`
      );
      const TipoInventario = `${req.user.USU_SEDE}`;
      res.render("InventarioMain", {
        TipoInventario: TipoInventario,
        listaInventarioMain: listaInventarioMain,
      });
      console.log(listaInventarioMain);
    } else if (req.user.USU_ROL == "Mesero") {
      const listaInventarioMain = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario WHERE UBICACION = "${req.user.USU_SEDE}"`
      );
      const TipoInventario = `${req.user.USU_SEDE}`;
      res.render("InventarioMain", {
        TipoInventario: TipoInventario,
        listaInventarioMain: listaInventarioMain,
      });
      console.log(listaInventarioMain);
    } else {
      res.redirect("/redirect");
    }
  } catch (error) {
    console.log(error);
    Respuesta = { Respuesta: "ok2" };
    res.json(Respuesta);
  }
});

router.get("/Ventas", isLoggedIn, async (req, res) => {
  try {
    if (req.user.USU_ROL == "Administrador") {
      const listaInventarioMain = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario WHERE ESTADO = "Activo"`
      );
      const listaMesas = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.mesas WHERE ESTADO = "Activo"`
      );
      res.render("Venta", {
        listaInventarioMain: listaInventarioMain,
        listaMesas: listaMesas,
      });
    } else if (req.user.USU_ROL == "Cajero" || req.user.USU_ROL == "Mesero") {
      const listaInventarioMain = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario WHERE UBICACION = "${req.user.USU_SEDE}" AND ESTADO = "Activo"`
      );
      const listaMesas = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.mesas WHERE ESTADO = "Activo" AND SEDE = "${req.user.USU_SEDE}"`
      );
      res.render("Venta", {
        listaInventarioMain: listaInventarioMain,
        listaMesas: listaMesas,
      });
    } else {
      res.redirect("/redirect");
    }
  } catch (error) {
    console.log(error);
    Respuesta = { Respuesta: "ok2" };
    res.json(Respuesta);
  }
});

router.get("/HistorialVenta", isLoggedIn, async (req, res) => {
  try {
    if (req.user.USU_ROL == "Administrador") {
      const PerimitirAdmin = true;
      const listaVentas = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.ventas`
      );
      // console.log(listaVentas);

      var data = [];
      var NombreArray = "";

      for (i = 0; i < listaVentas.length; i++) {
        var valoresObjeto = JSON.parse(listaVentas[i].VALORES);
        for (var key in valoresObjeto) {
          var objectId = key;
          var cantidad = valoresObjeto[key];
          var listaVentasNombre = await pool.query(
            `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario WHERE PK_ID_INVE = "${objectId}"`
          );
          var Nombre = listaVentasNombre[0].NOMBRE;
          NombreArray = NombreArray + Nombre + ": " + cantidad + " - ";
        }
        var NombreArray = NombreArray.slice(0, -3);
        data.push({
          NombreArray: NombreArray,
        });
        NombreArray = "";
      }

      // console.log(data);

      var arrayDeObjetos = listaVentas.map((row) => {
        return { ...row };
      });

      for (i = 0; i < data.length; i++) {
        arrayDeObjetos[i].NombreVenta = data[i].NombreArray;
      }

      // console.log(arrayDeObjetos);

      res.render("HistorialVentas", {
        listaVentas: arrayDeObjetos,
        PerimitirAdmin: PerimitirAdmin,
      });
    } else if (req.user.USU_ROL == "Cajero" || req.user.USU_ROL == "Mesero") {
      const PerimitirAdmin = false;
      const listaVentas = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.ventas WHERE SEDE = "${req.user.USU_SEDE}"`
      );
      // console.log(listaVentas);

      var data = [];
      var NombreArray = "";

      for (i = 0; i < listaVentas.length; i++) {
        var valoresObjeto = JSON.parse(listaVentas[i].VALORES);
        for (var key in valoresObjeto) {
          var objectId = key;
          var cantidad = valoresObjeto[key];
          var listaVentasNombre = await pool.query(
            `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario WHERE PK_ID_INVE = "${objectId}"`
          );
          var Nombre = listaVentasNombre[0].NOMBRE;
          NombreArray = NombreArray + Nombre + ": " + cantidad + " - ";
        }
        var NombreArray = NombreArray.slice(0, -3);
        data.push({
          NombreArray: NombreArray,
        });
        NombreArray = "";
      }

      // console.log(data);

      var arrayDeObjetos = listaVentas.map((row) => {
        return { ...row };
      });

      for (i = 0; i < data.length; i++) {
        arrayDeObjetos[i].NombreVenta = data[i].NombreArray;
      }

      // console.log(arrayDeObjetos);

      res.render("HistorialVentas", {
        listaVentas: arrayDeObjetos,
        PerimitirAdmin: PerimitirAdmin,
      });
    } else {
      res.redirect("/redirect");
    }
  } catch (error) {
    console.log(error);
    Respuesta = { Respuesta: "ok2" };
    res.json(Respuesta);
  }
});

router.get("/ValidarVentas", isLoggedIn, async (req, res) => {
  try {
    if (req.user.USU_ROL == "Administrador") {
      const PerimitirAdmin = true;
      const listaVentas = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.ventas WHERE ESTADO_VENTA = "Activo" AND SEDE = "${req.user.USU_SEDE}"`
      );
      // console.log(listaVentas);

      var data = [];
      var NombreArray = "";

      for (i = 0; i < listaVentas.length; i++) {
        var valoresObjeto = JSON.parse(listaVentas[i].VALORES);
        for (var key in valoresObjeto) {
          var objectId = key;
          var cantidad = valoresObjeto[key];
          var listaVentasNombre = await pool.query(
            `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario WHERE PK_ID_INVE = "${objectId}"`
          );
          var Nombre = listaVentasNombre[0].NOMBRE;
          NombreArray = NombreArray + Nombre + ": " + cantidad + " - ";
        }
        var NombreArray = NombreArray.slice(0, -3);
        data.push({
          NombreArray: NombreArray,
        });
        NombreArray = "";
      }

      // console.log(data);

      var arrayDeObjetos = listaVentas.map((row) => {
        return { ...row };
      });

      for (i = 0; i < data.length; i++) {
        arrayDeObjetos[i].NombreVenta = data[i].NombreArray;
      }

      // console.log(arrayDeObjetos);

      res.render("ValidarVentas", {
        listaVentas: arrayDeObjetos,
        PerimitirAdmin: PerimitirAdmin,
      });
    } else if (req.user.USU_ROL == "Cajero" || req.user.USU_ROL == "Mesero") {
      const PerimitirAdmin = false;
      const listaVentas = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.ventas WHERE ESTADO_VENTA = "Activo" AND SEDE = "${req.user.USU_SEDE}"`
      );
      // console.log(listaVentas);

      var data = [];
      var NombreArray = "";

      for (i = 0; i < listaVentas.length; i++) {
        var valoresObjeto = JSON.parse(listaVentas[i].VALORES);
        for (var key in valoresObjeto) {
          var objectId = key;
          var cantidad = valoresObjeto[key];
          var listaVentasNombre = await pool.query(
            `SELECT SQL_NO_CACHE * FROM ${bdd_name}.inventario WHERE PK_ID_INVE = "${objectId}"`
          );
          var Nombre = listaVentasNombre[0].NOMBRE;
          NombreArray = NombreArray + Nombre + ": " + cantidad + " - ";
        }
        var NombreArray = NombreArray.slice(0, -3);
        data.push({
          NombreArray: NombreArray,
        });
        NombreArray = "";
      }

      // console.log(data);

      var arrayDeObjetos = listaVentas.map((row) => {
        return { ...row };
      });

      for (i = 0; i < data.length; i++) {
        arrayDeObjetos[i].NombreVenta = data[i].NombreArray;
      }

      // console.log(arrayDeObjetos);

      res.render("ValidarVentas", {
        listaVentas: arrayDeObjetos,
        PerimitirAdmin: PerimitirAdmin,
      });
    } else {
      res.redirect("/redirect");
    }
  } catch (error) {
    console.log(error);
    Respuesta = { Respuesta: "ok2" };
    res.json(Respuesta);
  }
});

module.exports = router;
