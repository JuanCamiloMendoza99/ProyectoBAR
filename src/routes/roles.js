const express = require("express");
const router = express.Router();
const passport = require("passport");
const pool = require("../database");
const { isLoggedIn, isNotLoggedIn } = require("../lib/auth");

/* Ruta Roles - (Asesor) */
router.get("/gestionAsesor", isLoggedIn, async (req, res) => {
  if (
    req.user.USU_ROL == "Agente" ||
    req.user.USU_ROL == "Administrador"
  ) {
    try {
      var fechaActual = new Date();
      var hora = fechaActual.getHours();
      var minutos = fechaActual.getMinutes();
      var segundos = fechaActual.getSeconds();
      var dia = fechaActual.getDate();
      var mes = fechaActual.getMonth() + 1;
      var anio = fechaActual.getFullYear() % 100;

      if (hora < 10) {
        hora = "0" + hora;
      }

      if (minutos < 10) {
        minutos = "0" + minutos;
      }

      if (segundos < 10) {
        segundos = "0" + segundos;
      }

      var horaActual = hora + ":" + minutos + ":" + segundos;
      var diaActual = mes + "/" + dia + "/" + anio;

      const estadoHorario = await pool.query(
        `SELECT SQL_NO_CACHE * FROM  ${bdd_name}.tbl_horarios WHERE NUMERO_IDENTIFICACION = '${req.user.USU_DOCUMENTO}' AND FECHA_TURNO = '${diaActual}' `
      );

      console.log(estadoHorario.length);
      let Permitir;
      if (estadoHorario.length > 0) {
        // La consulta encontró datos
        var horaInicio = estadoHorario[0].INICIO_TURNO;
        var horaFinal = estadoHorario[0].FIN_TURNO;

        if (horaInicio.indexOf(":") === 1) {
          horaInicio = "0" + horaInicio;
        }

        if (horaFinal.indexOf(":") === 1) {
          horaFinal = "0" + horaFinal;
        }

        console.log("HORA ACTUAL: ", horaActual);
        console.log("HORA TURNO: ", horaInicio);
        console.log("HORA FINAL: ", horaFinal);

        function compararHorasInicio(hora1, hora2) {
          const [h1, m1, s1] = hora1.split(":");
          const [h2, m2, s2] = hora2.split(":");

          if (parseInt(h1) < parseInt(h2)) {
            return -1;
          } else if (parseInt(h1) > parseInt(h2)) {
            return 1;
          } else {
            if (parseInt(m1) < parseInt(m2)) {
              return -1;
            } else if (parseInt(m1) > parseInt(m2)) {
              return 1;
            } else {
              if (parseInt(s1) < parseInt(s2)) {
                return -1;
              } else if (parseInt(s1) > parseInt(s2)) {
                return 1;
              } else {
                return 0;
              }
            }
          }
        }

        function compararHorasFinal(hora1, hora2) {
          const [h1, m1, s1] = hora1.split(":");
          const [h2, m2, s2] = hora2.split(":");

          if (parseInt(h1) < parseInt(h2)) {
            return -1;
          } else if (parseInt(h1) > parseInt(h2)) {
            return 1;
          } else {
            if (parseInt(m1) < parseInt(m2)) {
              return -1;
            } else if (parseInt(m1) > parseInt(m2)) {
              return 1;
            } else {
              if (parseInt(s1) < parseInt(s2)) {
                return -1;
              } else if (parseInt(s1) > parseInt(s2)) {
                return 1;
              } else {
                return 0;
              }
            }
          }
        }

        const comparacionInicio = compararHorasInicio(horaActual, horaInicio);
        const comparacionFinal = compararHorasFinal(horaActual, horaFinal);

        let permitirInicio;
        let permitirFinal;

        if (comparacionInicio < 0) {
          console.log("La hora 1 es menor que la hora 2");
          permitirInicio = false;
        } else if (comparacionInicio > 0) {
          console.log("La hora 2 es menor que la hora 1");
          permitirInicio = true;
        } else {
          console.log("Las horas son iguales");
          permitirInicio = true;
        }

        if (comparacionFinal < 0) {
          console.log("La hora 1 es menor que la hora 2");
          permitirFinal = true;
        } else if (comparacionFinal > 0) {
          console.log("La hora 2 es menor que la hora 1");
          permitirFinal = false;
        } else {
          console.log("Las horas son iguales");
          permitirFinal = true;
        }

        console.log("PERMITIR INICIO: ", permitirInicio);
        console.log("PERMITIR FINAL: ", permitirFinal);

        if (permitirInicio == true && permitirFinal == true) {
          Permitir = true;
        } else {
          Permitir = false;
        }
      } else {
        // La consulta no encontró datos
        console.log("NO HAY TURNO");
        Permitir = false;
      }

      console.log("PERMITIR: ", Permitir);

      //VALIDO ESTADOS PARA MOSTRAR
      const listaEstadosBloqueados = localStorage.getItem(
        `${req.user.USU_LOGINCMS}`
      );

      if (listaEstadosBloqueados !== null) {
        const listaEstadosBloqueadosjson = JSON.parse(listaEstadosBloqueados);
        const miClave = "ESTADOS_BLOQUEADOS";
        if (!listaEstadosBloqueadosjson.hasOwnProperty(miClave)) {
          listaEstadosBloqueadosjson[miClave] = "";
          localStorage.setItem(
            `${req.user.USU_LOGINCMS}`,
            JSON.stringify(listaEstadosBloqueadosjson)
          );
        } else {
          const ESTADOS_BLOQUEADOS =
            listaEstadosBloqueadosjson.ESTADOS_BLOQUEADOS;
          const ESTADOS_BLOQUEADOS_ARRAY = ESTADOS_BLOQUEADOS.split("-");
          // console.log(ESTADOS_BLOQUEADOS_ARRAY);

          const listaEstadosBD = await pool.query(
            "SELECT SQL_NO_CACHE * FROM " +
              bdd_name +
              '.tbl_estados WHERE ESTADO_ESTADO = "Activo" '
          );

          const listaEstadosArray = [];

          for (let i = 0; i < listaEstadosBD.length; i++) {
            listaEstadosArray.push(listaEstadosBD[i].ESTADO);
          }

          var listaEstados = [];

          for (let i = 0; i < listaEstadosArray.length; i++) {
            if (!ESTADOS_BLOQUEADOS_ARRAY.includes(listaEstadosArray[i])) {
              // console.log(
              //   `El elemento ${listaEstadosArray[i]} no está presente en ambos arrays`
              // );
              let listaEstadosJson = {
                ESTADO: listaEstadosArray[i],
              };
              listaEstados.push(listaEstadosJson);
            }
          }
        }
      } else {
        console.log("No data en localStorage");
        var listaEstados = await pool.query(
          "SELECT SQL_NO_CACHE * FROM " +
            bdd_name +
            '.tbl_estados WHERE ESTADO_ESTADO = "Activo" '
        );
      }

      const listaTransferencias = await pool.query(
        "SELECT SQL_NO_CACHE * FROM " +
          bdd_name +
          '.tbl_transferencias WHERE ESTADO = "Activo" '
      );

      const listaTipificaciones = await pool.query(
        "SELECT SQL_NO_CACHE * FROM " +
          bdd_name +
          '.tbl_tipificaciones WHERE ESTADO = "Activo" '
      );

      res.render("gestionAsesor/gestionAsesor", {
        listaEstados: listaEstados,
        listaTransferencias: listaTransferencias,
        listaTipificaciones: listaTipificaciones,
        Permitir: Permitir,
      });
    } catch (error) {
      console.log(error);
      Respuesta = { Respuesta: "ok2" };
      res.json(Respuesta);
    }
  } else {
    res.redirect("/redirect");
  }
});

/* Ruta Roles - (Supervisor) */
router.get("/reportingSupervisor", isLoggedIn, async (req, res) => {
  if (
    req.user.USU_ROL == "Administrador" ||
    req.user.USU_ROL == "Supervisor"
  ) {
    try {
      const listaEstados = await pool.query(
        "SELECT SQL_NO_CACHE * FROM " +
          bdd_name +
          '.tbl_estados WHERE ESTADO_ESTADO = "Activo" '
      );
      const cedulaSupervisor = req.user.USU_DOCUMENTO;
      let dataReportingGestionSAC = [];
      const sql = `SELECT SQL_NO_CACHE USU_LOGINCMS FROM ${bdd_name}.users WHERE USU_RESPONSABLE_GESTION = '${cedulaSupervisor}'`;
      const dataReportingLoacalStorage = await pool.query(sql);

      for (let i = 0, l = dataReportingLoacalStorage.length; i < l; i++) {
        var dataRecibida = JSON.parse(
          localStorage.getItem(dataReportingLoacalStorage[i].USU_LOGINCMS)
        );
        if (dataRecibida !== null) {
          // El dato existe en el localStorage
          dataReportingGestionSAC.push(dataRecibida);
        } else {
          console.log("No existe el dato en el localStorage");
        }
      }

      const listaNombreAsesor = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.users WHERE USU_ESTADO = "Activo" AND USU_RESPONSABLE_GESTION = "${cedulaSupervisor}"`
      );

      res.render("reportingSupervisor/reportingSupervisor", {
        dataReportingGestionSAC: dataReportingGestionSAC,
        listaNombreAsesor: listaNombreAsesor,
        listaEstados: listaEstados,
      });
    } catch (error) {
      Respuesta = { Respuesta: "ok2" };
      res.json(Respuesta);
    }
  } else {
    res.redirect("/redirect");
  }
});

router.get("/modificarHorarios", isLoggedIn, async (req, res) => {
  if (
    req.user.USU_ROL == "Supervisor" ||
    req.user.USU_ROL == "Administrador"
  ) {
    try {
      const cedulaSupervisor = req.user.USU_DOCUMENTO;
      const listaHorariosAsesor = await pool.query(
        `SELECT SQL_NO_CACHE * FROM ${bdd_name}.tbl_horarios WHERE IDENTIFICACION_RESPONSABLE = "${cedulaSupervisor}"`
      );
      console.log(listaHorariosAsesor);
      res.render("reportingSupervisor/modificarHorarios", {
        listaHorariosAsesor: listaHorariosAsesor,
      });
    } catch (error) {
      Respuesta = { Respuesta: "ok2" };
      res.json(Respuesta);
    }
  } else {
    res.redirect("/redirect");
  }
});

router.get("/cargueHorarios", isLoggedIn, async (req, res) => {
  if (
    req.user.USU_ROL == "Agente" ||
    req.user.USU_ROL == "Administrador"
  ) {
    try {
      res.render("reportingSupervisor/cargueHorarios", {});
    } catch (error) {
      Respuesta = { Respuesta: "ok2" };
      res.json(Respuesta);
    }
  } else {
    res.redirect("/redirect");
  }
});

module.exports = router;
