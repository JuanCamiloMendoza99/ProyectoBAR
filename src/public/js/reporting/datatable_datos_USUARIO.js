"use stric";

document.addEventListener("DOMContentLoaded", () => {
  let TABLAUSU = $("#Reporte_Casos_Usuario").DataTable({
    order: [[0, "desc"]],
    iDisplayLength: 3,
    aLengthMenu: [
      [3, 5, 10, 25, 50, -1],
      [3, 5, 10, 25, 50, "All"],
    ],
    columnDefs: [
      {
        // targets: [],
        visible: true,
        searchable: true,
      },
    ],
    dom: "lfrtipB",
    buttons: [],

    language: {
      lengthMenu: "Mostrar _MENU_ registros",
      zeroRecords: "No se encontraro resultados",
      info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
      infoEmpty: "Mostrando registros de 0 al 0 de un total de 0 registros",
      infoFiltered: "(Filtrado de un total de _MAX_ registros)",
      sSearch: "Buscar",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Ultimo",
        sNext: ">>",
        sPrevious: "<<",
      },
      sProcessing: "Procesando",
      paginate: {
        previous: "<i class='mdi mdi-chevron-left'>",
        next: "<i class='mdi mdi-chevron-right'>",
      },
    },
  });

  $(document).on("click", "#omodal_dashboard", async () => {
    let resultado = await postData("/perfildatos");
    // console.log(resultado);

    const tabla = document.querySelector("#Reporte_Casos_Usuario tbody");

    let tbodyhtml = ``;
    console.log(resultado);
    resultado.forEach((row) => {
      tbodyhtml += `
              <tr>
                  <td><center>${row.TIPO_SOLICITUD}</center></td>
                  <td><center>${row.DATOS}</center></td>
                  <td><center>${row.ESTADO}</center></td>
                  <td><center>${row.MENSAJE}</center></td>                  
              </tr>`;
    });

    //Destruyo la tabla
    TABLAUSU.destroy();

    tabla.innerHTML = tbodyhtml;
    TABLAUSU = $("#Reporte_Casos_Usuario").DataTable({
      order: [[0, "desc"]],
      iDisplayLength: 3,
      aLengthMenu: [
        [3, 5, 10, 25, 50, -1],
        [3, 5, 10, 25, 50, "All"],
      ],
      columnDefs: [
        {
          // targets: [],
          visible: true,
          searchable: true,
        },
      ],
      dom: "lfrtipB",
      buttons: [],
  
      language: {
        lengthMenu: "Mostrar _MENU_ registros",
        zeroRecords: "No se encontraro resultados",
        info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Mostrando registros de 0 al 0 de un total de 0 registros",
        infoFiltered: "(Filtrado de un total de _MAX_ registros)",
        sSearch: "Buscar",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Ultimo",
          sNext: ">>",
          sPrevious: "<<",
        },
        sProcessing: "Procesando",
        paginate: {
          previous: "<i class='mdi mdi-chevron-left'>",
          next: "<i class='mdi mdi-chevron-right'>",
        },
      },
    });
  });
});
