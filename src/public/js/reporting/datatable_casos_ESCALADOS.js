"use stric";

document.addEventListener("DOMContentLoaded", () => {
  
  let TABLAUSU = $("#Reporte_Casos_Escalados").DataTable({
    order: [[2, "desc"]],
    iDisplayLength: 5,
    aLengthMenu: [
      [3, 5, 10, 25, 50, -1],
      [3, 5, 10, 25, 50, "All"],
    ],
    columnDefs: [
      {
        targets: [1],
        visible: true,
        searchable: false,
      },
    ],
    dom: "lfrtipB",
    buttons: ["copy", "excel", "csv"],

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
    }
  });

  $(document).on('click', "#omodal", async () => {
    if (TABLAUSU) {

      let resultado = await postData("/casosescalados");

      let area = document.getElementById('txtarea_gestion').value;
      let rol = document.getElementById('txtrol').value;
      let responsable = document.getElementById('txtresponsable_gestion').value;
      let usuario = document.getElementById('txtusuario_red').value;
      
      const tabla = document.querySelector("#Reporte_Casos_Escalados tbody");

      let tbodyhtml = ``;
      resultado.forEach((element) => {
        let arr = Object.values(element);
        console.log(arr[14]);
        tbodyhtml += `
            <tr>
              <td><center>${arr[14]}${arr[13]}</center></td>
              <td style="color: blue"><center><div semaforo="" class="${arr[15]}">${arr[15]}</div></center></td>            
              <td><center>${arr[0]}</center></td>
              <td><center><a class="btn btn-primary" data-toggle="modal" href="#admincasos_backoffice_${arr[13]}" id="omodal_back" role="button"><i class="fas fa-edit"></i></a></center>
                `+`
                  <div class="modal fade"  id="admincasos_backoffice_${arr[13]}" tabindex="-1" role="dialog" aria-labelledby="admincasos_backofficeTitle" aria-hidden="true" style="height: 850px">
                    <div class="modal-dialog modal-full" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="admincasos_backofficeTitle"><i class="fas fa-edit"></i> Actualizar Caso Front</h5>
                                            
                          <div class="form-row">
                            <div semaforo="" style="float: left; margin-right: 10px; padding-right: 10px; border-right: 0.5px solid grey;">
                              <div semaforo="" class="rojo" style="float: left; margin-right: 5px;"></div>P1
                            </div>
                            <div semaforo="" style="float: left; margin-right: 10px; padding-right: 10px; border-right: 0.5px solid grey;">
                              <div semaforo="" class="amarillo" style="float: left; margin-right: 5px;"></div>P2
                            </div>
                            <div semaforo="">
                              <div semaforo="" class="verde" style="float: left; margin-right: 5px;"></div>P3
                            </div>
                          </div>

                        </div>
                        <div class="modal-body">
                          <div class="form-row">
                            <div class="card-body">

                              <form action="escalamiento/${arr[13]}" method="POST">                                                            
                                <div class="form-row">

                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txtfecha_hora_registro" class="col-form-label">Canal</label>
                                    <input type="text" name="skill" id="txtskill_modal" class="form-control form-control-1" value="${arr[14]}" readonly>
                                  </div>
                              
                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txtfecha_hora_registro" class="col-form-label">No. Caso</label>
                                    <input type="text" name="id_modal" id="txtid_modal" class="form-control form-control-1" value="${arr[13]}" readonly>
                                  </div> 
                        
                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txtfecha_hora_registro" class="col-form-label">Fecha / Hora Registro</label>
                                    <input type="text" name="fecha_hora_registro" id="txtfecha_hora_registro_modal" class="form-control form-control-1" value="${arr[0]}" readonly>
                                  </div>    

                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txtresponsable_gestion" class="col-form-label">Responsable Gestión</label>
                                    <input type="text" name="responsable_gestion" id="txtresponsable_gestion_modal" class="form-control form-control-1" value="${arr[1]}" readonly>
                                  </div>

                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txtusuario_red" class="col-form-label">Usuario Red</label>
                                    <input type="text" name="usuario_red" id="txtusuario_red_modal" class="form-control form-control-1" value="${arr[2]}" readonly>
                                  </div> 

                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txtarea_gestion" class="col-form-label">Área Gestión</label>
                                    <input type="text" name="area_gestion" id="txtarea_gestion_modal" class="form-control form-control-1" value="${arr[3]}" readonly>
                                  </div>

                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txtrol" class="col-form-label">Rol</label>
                                    <input type="text" name="rol" id="txtrol_modal" class="form-control form-control-1" value="${arr[4]}" readonly>
                                  </div>

                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txtcontacto_cliente" class="col-form-label">Contacto Cliente</label>
                                    <input type="text" name="contacto_cliente" id="txtcontacto_cliente_modal" class="form-control" data-toggle="tooltip" data-placement="bottom" value="${arr[8]}" maxlength="200" readonly>
                                  </div>

                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txtnum_cont_cliente" class="col-form-label">Número Contacto Cliente</label>
                                    <input type="text" name="num_cont_cliente" id="txtnum_cont_cliente_modal" class="form-control" data-toggle="tooltip" data-placement="bottom" value="${arr[9]}" maxlength="200" readonly>
                                  </div>

                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txtfalla_solicitud" class="col-form-label">Falla / Solicitud</label>
                                    <input type="text" name="falla_solicitud" id="txtfalla_solicitud_modal" list="crud_fallas_solicitudes" class="form-control" data-toggle="tooltip" data-placement="bottom" value="${arr[5]}" maxlength="200" readonly>
                                  </div>

                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txtcuenta_enlace" class="col-form-label">Cuenta o Enlace</label>
                                    <input type="text" name="cuenta_enlace" id="txtcuenta_enlace_modal" list="crud_cuenta_generica" class="form-control" data-toggle="tooltip" data-placement="bottom" value="${arr[6]}" maxlength="200" readonly>
                                  </div>

                                  <div class="form-group col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                    <label for="txttecnologia" class="col-form-label">Tecnología</label>
                                    <input type="text" name="tecnologia" id="txttecnologia_modal" list="crud_tecnologia" class="form-control" data-toggle="tooltip" data-placement="bottom" value="${arr[7]}" maxlength="200" readonly>
                                  </div>
                                </div>
                    
                                <div class="form-row">
                                  <div class="form-group col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                    <label for="txtobservaciones" class="col-form-label">Observaciones</label>
                                    <textarea rows="5" name="observaciones" id="txtobservaciones_modal" class="form-control" data-toggle="tooltip" data-placement="bottom" readonly>${arr[10]}</textarea>
                                  </div>
                                </div>
                    
                                <div class="form-row">
                                  <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                    <label for="txtticket_radicado" class="col-form-label">Ticket / Radicado</label>
                                    <input type="text" name="ticket_radicado" id="txtticket_radicado_modal" class="form-control" data-toggle="tooltip" data-placement="bottom" value="${arr[11]}" maxlength="200" readonly>
                                  </div>                                

                                  <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                    <div class="input-group-prepend">
                                      <label for="txtestado_caso_modal" class="col-form-label">Estado Caso</label>
                                    </div>
                                    <select class="custom-select form-control" name="estado_caso" id="txtestado_caso_modal" required>
                                      <option value="">Elige una opción</option>
                                      <option value="Escalado">Escalado</option>
                                      <option value="Cerrado">Cerrado</option>
                                      <option value="Seguimiento">Seguimiento</option>
                                    </select>
                                  </div>
                                </div>

                                <center>
                                  <button type="submit" name="action" class="btn btn-success btn-rounded waves-effect waves-light">
                                    <span class="btn-label"><i class="fas fa-database"></i></span> Guardar Caso
                                  </button>                                                                    
                                </center>

                                <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                                  <div class="panel panel-default">
                                    <div class="panel-heading" role="tab" id="headingComent">
                                      <h4 class="panel-title">                                    
                                        <a class="btn btn-primary btn-lg btn-block" role="button" onclick="tablaComent('${arr[13]}', '${arr[14]}', 'colors_${arr[13]}', 'Comentarios_Backoffice_${arr[13]}')" data-toggle="collapse" data-parent="#accordion" href="#collapseComent_${arr[13]}" aria-expanded="true" aria-controls="collapseComent_${arr[13]}">
                                          Observaciones BackOffice
                                        </a>                                   
                                      </h4>
                                    </div>
                                    <div id="collapseComent_${arr[13]}" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingComent">
                                      <div class="panel-body">
                                      
                                        <div class="table-responsive">
                                          <table id="Comentarios_Backoffice_${arr[13]}" class="table">
                                            <thead>
                                              <tr id="colors_${arr[13]}">
                                                <th><center>No.</center></th>
                                                <th><center>FECHA REGISTRO</center></th>
                                                <th><center>OBSERVACION</center></th>
                                                <th><center>USUARIO BACKOFFICE</center></th>
                                                <th><center>NOMBRE BACKOFFICE</center></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>                                    
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>    

                                <div class="button-list">
                                  <button type="button" class="btn btn-info" data-toggle="modal" data-target="#agregar_coment_back_${arr[13]}"><i class="fas fa-plus"></i></button>                            
                                  <button type="button" class="btn btn-secondary" onclick="closeMOdal('admincasos_backoffice_${arr[13]}')" >Cerrar</button>
                                </div>
                              </form>

                                  <div class="modal fade" data-backdrop="static" id="agregar_coment_back_${arr[13]}" tabindex="-1" role="dialog" aria-labelledby="agregar_coment_backTitle" aria-hidden="true" style="height: 850px">
                                    <div class="modal-dialog modal-lg" role="document">
                                      <div class="modal-content">
                                        <div class="modal-header">
                                          <h5 class="modal-title" id="agregar_coment_backTitle"><i class="fas fa-plus"></i> Agregar Comentario</h5>
                                          <button type="button" class="close" onclick="closeMOdal('agregar_coment_back_${arr[13]}')">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>
                                        <div class="modal-body">
                                          <form id="form_coment_${arr[13]}"> 
                                            <div class="form-row">
                                              <div  class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                  <label for="txtfecha_hora_registro" class="col-form-label">Canal</label>
                                                  <input type="text" name="skill_coment" id="txtskill_coment_${arr[13]}" class="form-control form-control-1" value="${arr[14]}" readonly>
                                              </div>
                                    
                                              <div  class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                  <label for="txtfecha_hora_registro" class="col-form-label">No. Caso</label>
                                                  <input type="text" name="id_coment" id="txtid_coment_${arr[13]}" class="form-control form-control-1" value="${arr[13]}" readonly>
                                              </div>                                              
                                            </div>  

                                            <div class="form-row">
                                              <div class="form-group col-sm-6 col-md-6 col-lg-3 col-xl-3">
                                                <label for="txtarea_gestion" class="col-form-label">Área Gestión</label>
                                                <input type="text" name="area_gestion_coment" id="txtarea_gestion_coment_${arr[13]}" class="form-control form-control-1" value="${area}" autocomplete="off" readonly>
                                              </div>

                                              <div class="form-gol-sm-6 col-md-6 col-lg-3 col-xl-3">
                                                <label for="txtrol_coment" class="col-form-label">Rol</label>
                                                <input type="text" name="rol_coment" id="txtrol_coment_${arr[13]}" class="form-control form-control-1" value="${rol}" autocomplete="off" onchange="edito(this)" readonly>
                                              </div>

                                              <div class="form-group col-sm-6 col-md-6 col-lg-3 col-xl-3">
                                                <label for="txtresponsable_gestion" class="col-form-label">Responsable Gestión</label>
                                                <input type="text" name="responsable_gestion_coment" id="txtresponsable_gestion_coment_${arr[13]}" class="form-control form-control-1" value="${responsable}" autocomplete="off" readonly>
                                              </div>
                                              
                                              <div class="form-group col-sm-6 col-md-6 col-lg-3 col-xl-3">
                                                <label for="txtusuario_red" class="col-form-label">Usuario Red</label>
                                                <input type="text" name="usuario_red_coment" id="txtusuario_red_coment_${arr[13]}" class="form-control form-control-1" value="${usuario}" autocomplete="off" readonly>
                                              </div>
                                            </div>
                                            <div class="form-row">
                                              <div class="form-group col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                                <label for="txtcomentario_back" class="col-form-label">Observaciones</label>
                                                <textarea rows="6" name="comentario_back_coment" id="txtcomentario_back_${arr[13]}" class="form-control" data-toggle="tooltip" data-placement="bottom"></textarea>
                                              </div>
                                            </div>
                                            <center>
                                              <button type="submit" id="guardar_coment" onclick="submitComent('form_coment_${arr[13]}', '${arr[13]}')" class="btn btn-primary btn-rounded waves-effect waves-light">
                                                <span class="btn-label"><i class="fas fa-database"></i></span>Guardar Comentario
                                              </button>
                                            </center>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                            </div>
                          </div>                          
                        </div>                                                
                      </div>                                      
                    </div>
                  </div>            
              </td>`+`
              <td><center><strong>${arr[12]}</strong></center></td>
              <td><center>${arr[1]}</center></td>
              <td><center>${arr[2]}</center></td>
              <td><center>${arr[3]}</center></td>
              <td><center>${arr[4]}</center></td>
              <td><center>${arr[5]}</center></td>
              <td><center>${arr[6]}</center></td>
              <td><center>${arr[7]}</center></td>
              <td><center>${arr[8]}</center></td>
              <td><center>${arr[9]}</center></td>
              <td><center>${arr[10]}</center></td>
              <td><center>${arr[11]}</center></td>            
            </tr>`;
      });

      //Destruyo la tabla
      TABLAUSU.destroy();

      tabla.innerHTML = tbodyhtml;

      TABLAUSU = $("#Reporte_Casos_Escalados").DataTable({
        order: [[2, "desc"]],
        iDisplayLength: 5,
        aLengthMenu: [
          [3, 5, 10, 25, 50, -1],
          [3, 5, 10, 25, 50, "All"],
        ],
        columnDefs: [
          {
            targets: [1],
            visible: true,
            searchable: false,
          },
        ],
        dom: "lfrtipB",
        buttons: ["copy", "excel", "csv"],

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
        }
      });
    }
  });
});

