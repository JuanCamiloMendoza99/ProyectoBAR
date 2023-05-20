"use stric";

document.getElementById("containerLoader").classList.remove("hidden");

document.addEventListener("DOMContentLoaded", async () => {
  var ListaInventario = $("#ReporteInventarioVenta").DataTable({
    iDisplayLength: 5,
    aLengthMenu: [
      [3, 5, 10, 25, 50, -1],
      [3, 5, 10, 25, 50, "All"],
    ],
    columnDefs: [
      {
        targets: [],
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

  var ListaInventario = $("#CarritoCompras").DataTable({
    iDisplayLength: 5,
    aLengthMenu: [
      [3, 5, 10, 25, 50, -1],
      [3, 5, 10, 25, 50, "All"],
    ],
    columnDefs: [
      {
        targets: [],
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

  // Variables

  const sede = document.getElementById("sede").innerHTML;

  let baseDeDatos = await postData("/consultarInventarioVentas", {
    sede: sede,
  });
  console.log(baseDeDatos);

  let carrito = [];
  const divisa = "$";
  const DOMitems = document.querySelector("#items");
  const DOMcarrito = document.querySelector("#carrito");
  const DOMtotal = document.querySelector("#total");
  const DOMbotonVaciar = document.querySelector("#boton-vaciar");

  // Funciones

  /**
   * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
   */
  function renderizarProductos() {
    baseDeDatos.forEach((info) => {
      console.log(info.NOMBRE);
      // Estructura
      const miNodo = document.createElement("div");
      miNodo.classList.add("card", "col-sm-4");
      // Body
      const miNodoCardBody = document.createElement("div");
      miNodoCardBody.classList.add("card-body");
      // Titulo
      const miNodoTitle = document.createElement("h5");
      miNodoTitle.classList.add("card-title");
      miNodoTitle.textContent = info.NOMBRE;
      // Imagen
      const miNodoImagen = document.createElement("img");
      miNodoImagen.classList.add("img-fluid");
      miNodoImagen.setAttribute("src", info.RUTA_IMG);
      //Precio
      const miNodoPrecio = document.createElement("p");
      miNodoPrecio.classList.add("card-text");
      miNodoPrecio.textContent = `${info.PRECIO}${divisa}`;
      // Boton
      const miNodoBoton = document.createElement("button");
      miNodoBoton.classList.add("btn", "btn-primary");
      miNodoBoton.textContent = "+";
      miNodoBoton.setAttribute("marcador", info.PK_ID_INVE);
      miNodoBoton.addEventListener("click", anyadirProductoAlCarrito);
      // Insertamos
      miNodoCardBody.appendChild(miNodoImagen);
      miNodoCardBody.appendChild(miNodoTitle);
      miNodoCardBody.appendChild(miNodoPrecio);
      miNodoCardBody.appendChild(miNodoBoton);
      miNodo.appendChild(miNodoCardBody);
      DOMitems.appendChild(miNodo);
    });
  }

  /**
   * Evento para añadir un producto al carrito de la compra
   */
  function anyadirProductoAlCarrito(evento) {
    // Anyadimos el Nodo a nuestro carrito
    carrito.push(evento.target.getAttribute("marcador"));
    // Actualizamos el carrito
    renderizarCarrito();
  }

  /**
   * Dibuja todos los productos guardados en el carrito
   */
  function renderizarCarrito() {
    // Vaciamos todo el html
    DOMcarrito.textContent = "";
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
      // Obtenemos el item que necesitamos de la variable base de datos
      const miItem = baseDeDatos.filter((itemBaseDatos) => {
        // ¿Coincide las id? Solo puede existir un caso
        return itemBaseDatos.PK_ID_INVE === parseInt(item);
      });
      // Cuenta el número de veces que se repite el producto
      const numeroUnidadesItem = carrito.reduce((total, itemId) => {
        // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
        return itemId === item ? (total += 1) : total;
      }, 0);
      // Creamos el nodo del item del carrito
      const miNodo = document.createElement("li");
      miNodo.classList.add("list-group-item", "text-right", "mx-2");
      miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].NOMBRE} - ${miItem[0].PRECIO}${divisa}`;
      // Boton de borrar
      const miBoton = document.createElement("button");
      miBoton.classList.add("btn", "btn-danger", "mx-5");
      miBoton.textContent = "X";
      miBoton.style.marginLeft = "1rem";
      miBoton.dataset.item = item;
      miBoton.addEventListener("click", borrarItemCarrito);
      // Mezclamos nodos
      miNodo.appendChild(miBoton);
      DOMcarrito.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotal();
  }

  /**
   * Evento para borrar un elemento del carrito
   */
  function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
      return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
  }

  /**
   * Calcula el precio total teniendo en cuenta los productos repetidos
   */
  function calcularTotal() {
    // Recorremos el array del carrito
    return carrito.reduce((total, item) => {
      // De cada elemento obtenemos su precio
      const miItem = baseDeDatos.filter((itemBaseDatos) => {
        return itemBaseDatos.PK_ID_INVE === parseInt(item);
      });
      // Los sumamos al total
      return total + parseInt(miItem[0].PRECIO);
    }, 0);
  }

  /**
   * Varia el carrito y vuelve a dibujarlo
   */
  function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
  }

  // Eventos
  DOMbotonVaciar.addEventListener("click", vaciarCarrito);

  // Inicio
  renderizarProductos();
  renderizarCarrito();

  const botonPagar = document.getElementById("botonPagar");
  const Mesa = document.getElementById("Mesa");

  botonPagar.addEventListener("click", async () => {
    console.log(carrito);
    console.log(total.innerHTML);
    if (Mesa.value == "" || carrito == "") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "!Tienes Campos Vacios!",
        html: `•  Por favor ingresa: </br>
                1.  Selecciona una Mesa</br>
                2.  Agrega un Producto al Carrito`,
      });
    } else {
      const validar = await postData("/generarCompra", {
        carrito: carrito,
        total: total.innerHTML,
        Mesa: Mesa.value,
      });
      if (validar.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: validar.message,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: validar.message,
        });
      }
      console.log(validar);
    }
  });

  document.getElementById("containerLoader").classList.add("hidden");
});
