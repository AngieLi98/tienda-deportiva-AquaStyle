let tarjetas = document.querySelectorAll(".card");

// Recorremos cada tarjeta encontrada
tarjetas.forEach((card) => {
  let id = card.getAttribute("data-id");
  let idNumerico = parseInt(id);

  let producto = productos[idNumerico - 1];
  if (producto) {
    let info = card.querySelector(".info");
    let acciones = card.querySelector(".acciones");

    info.innerHTML =
      '<img src="' +
      producto.imagen +
      '" alt="' +
      producto.nombre +
      '" width="150">' +
      "<h5>" +
      producto.nombre +
      "</h5>" +
      "<p>Precio: $" +
      producto.precio.toLocaleString("es-CO") +
      "</p>";

    if (acciones) {
      acciones.innerHTML =
        '<button class="btn btn-agregar mt-2" data-id="' +
        id +
        '">Agregar al Carrito</button>';
    }
  } else {
    console.error(`Error: No se encontró el producto con ID ${id}`);
  }
});

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
// agregar productos al carrito
function agregarAlCarrito(idProducto) {
  const id = parseInt(idProducto);
  const item = productos.find((p) => p.id === id);

  if (!item) return;

  const existe = carrito.find((prod) => prod.id === id);

  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ ...item, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarritoUI();
  animacionProductoAgregado(item.nombre);
  mostrarCarrito();
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-agregar")) {
    let productoId = e.target.getAttribute("data-id");
    agregarAlCarrito(productoId);
  }
});

function actualizarCarritoUI() {
  const totalItems = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  const contador = document.getElementById("contador-carrito");

  if (contador) {
    contador.textContent = totalItems;
    contador.style.display = totalItems > 0 ? "inline-block" : "none";
  }
}

function animacionProductoAgregado(nombreProducto) {
  alert(`🛒 ¡Producto agregado! "${nombreProducto}" se ha añadido al carrito.`);
}

function aumentarCantidad(id) {
  const producto = carrito.find((p) => p.id === id);
  if (producto) {
    producto.cantidad++;
    guardarCarrito();
    mostrarCarrito();
    actualizarCarritoUI();
  }
}

function disminuirCantidad(id) {
  const producto = carrito.find((p) => p.id === id);

  if (producto) {
    producto.cantidad--;

    if (producto.cantidad <= 0) {
      carrito = carrito.filter((p) => p.id !== id);
    }

    guardarCarrito();
    mostrarCarrito();
    actualizarCarritoUI();
  }
}

function borrarProducto(id) {
  carrito = carrito.filter((p) => p.id !== id);
  guardarCarrito();
  mostrarCarrito();
  actualizarCarritoUI();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
  actualizarCarritoUI();
}

function mostrarCarrito() {
  const contenedor = document.getElementById("productos-carrito");
  const totalSpan = document.getElementById("total-carrito");

  if (!contenedor) return;

  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach((item) => {
    total += item.precio * item.cantidad;

    const div = document.createElement("div");
    div.classList.add("produc-carrito");

    div.innerHTML = `
            <img src="${item.imagen}" width="120">
            <div class="informacion">
                <h6>${item.nombre}</h6>
                <p>$${item.precio.toLocaleString("es-CO")}</p>

                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm cantidad"
                        onclick="disminuirCantidad(${item.id})">-</button>

                    <span>${item.cantidad}</span>

                    <button class="btn btn-sm cantidad"
                        onclick="aumentarCantidad(${item.id})">+</button>
                </div>
            </div>

            <button class="btn btn-sm btn-danger"
                onclick="borrarProducto(${item.id})">🗑</button>
        `;

    contenedor.appendChild(div);
  });

  if (totalSpan) {
    totalSpan.textContent = total.toLocaleString("es-CO");
  }

  if (carrito.length === 0 && totalSpan) {
    totalSpan.textContent = "0";
  }
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("🛒 Tu carrito está vacío");
        return;
    }

    const total = carrito.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );

    const confirmar = confirm(
        `Total a pagar: $${total.toLocaleString('es-CO')}\n\n¿Deseas finalizar la compra?`
    );

    if (!confirmar) return;

    alert("✅ ¡Compra realizada con éxito!");

    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    actualizarCarritoUI();

    // cerrar offcanvas
    const offcanvas = bootstrap.Offcanvas.getInstance(
        document.getElementById("offcanvasScrolling")
    );
    offcanvas.hide();
}


document.addEventListener("DOMContentLoaded", () => {
  actualizarCarritoUI();
  mostrarCarrito();
});
