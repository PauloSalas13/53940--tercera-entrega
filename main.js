const menu = [
    { id: "imagen1", titulo: "alcachofas con romesco", precio: 5000, img: "./img/01.jpg" },
    { id: "imagen2", titulo: "arroz con pollo", precio: 5500, img: "./img/02.jpg" },
    { id: "imagen3", titulo: "carpaccio de carabinero", precio: 6000, img: "./img/03.jpg" },
    { id: "imagen4", titulo: "chipirones salteado", precio: 5200, img: "./img/04.jpg" },
    { id: "imagen5", titulo: "cochinillo asado", precio: 4800, img: "./img/05.jpg" },
    { id: "imagen6", titulo: "hamburguesa de vaca", precio: 5300, img: "./img/06.jpg" },
    { id: "imagen7", titulo: "hummus de edamames", precio: 5900, img: "./img/07.jpg" },
    { id: "imagen8", titulo: "mejor que un 69", precio: 5100, img: "./img/08.jpg" },
    { id: "imagen9", titulo: "mi sushi cañi", precio: 5400, img: "./img/09.jpg" },
    { id: "imagen10", titulo: "ostra fine claire", precio: 5700, img: "./img/10.jpg" },
    { id: "imagen11", titulo: "rolling con oishii", precio: 5800, img: "./img/11.jpg" },
    { id: "imagen12", titulo: "steak tarta de solo", precio: 5600, img: "./img/12.jpg" },
    { id: "imagen13", titulo: "suru bi gran parana", precio: 6200, img: "./img/13.jpg" },
    { id: "imagen14", titulo: "tartar de atun rojo", precio: 5300, img: "./img/14.jpg" }
];

let pedido = localStorage.getItem('pedido') ? JSON.parse(localStorage.getItem('pedido')) : [];

function generarPlatoHTML(plato) {
    const cantidad = pedido.find(item => item.id === plato.id)?.cantidad || 0;
    return `
                <img src="${plato.img}" alt="${plato.titulo}" class="img-fluid">
                <h3>${plato.titulo}</h3>
                <p>$${plato.precio}</p>
                <div>
                    <input type="number" min="0" value="${cantidad}" id="${plato.id}-cantidad" onchange="actualizarCantidad('${plato.id}', this.value)">
                </div>
                <button class="agregar-al-pedido btn btn-primary" onclick="agregarAlPedido('${plato.id}', '${plato.titulo}', ${plato.precio})">Agregar al Pedido</button>
    `;
}

function mostrarPlatos() {
    const menuDiv = document.querySelector('.menu');
    menuDiv.innerHTML = "";
    menu.forEach(plato => {
        const platoDiv = document.createElement('div');
        platoDiv.innerHTML = generarPlatoHTML(plato);
        menuDiv.appendChild(platoDiv);
    });
}

function mostrarPedido() {
    const pedidoTabla = document.getElementById('pedidoTabla');
    const totalPedido = document.getElementById('totalPedido');
    pedidoTabla.innerHTML = `
        <tr>
            <th>Plato</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Acciones</th>
        </tr>`;
    let total = 0;
    pedido.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.titulo}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio}</td>
            <td>$${subtotal}</td>
            <td>
                <button class="boton-mas" onclick="agregarAlPedido('${item.id}', '${item.titulo}', ${item.precio})">+</button>
                <button class="boton-menos" onclick="quitarDelPedido('${item.id}')">-</button>
            </td>`;
        pedidoTabla.appendChild(row);
    });
    totalPedido.textContent = `Total: $${total}`;
    document.getElementById('pedidoPopup').style.display = 'block';
}

function cerrarPedido() {
    document.getElementById('pedidoPopup').style.display = 'none';
}

function confirmarPedido() {
    alert('Pedido confirmado');
    limpiarOrden();
}

function limpiarOrden() {
    pedido = [];
    localStorage.removeItem('pedido');
    const pedidoTabla = document.getElementById('pedidoTabla');
    pedidoTabla.innerHTML = `<tr><th>Plato</th><th>Cantidad</th><th>Precio Unitario</th><th>Subtotal</th></tr>`;
    const totalPedido = document.getElementById('totalPedido');
    totalPedido.textContent = `Total: $0`;
    mostrarPedido();
}


function quitarDelPedido(id) {
    const index = pedido.findIndex(item => item.id === id);
    if (index !== -1) {
        if (pedido[index].cantidad === 1) {
            pedido.splice(index, 1);
        } else {
            pedido[index].cantidad--;
        }
    }
    mostrarPedido();
}

function agregarAlPedido(id, titulo, precio) {
    const index = pedido.findIndex(item => item.id === id);
    if (index !== -1) {
        pedido[index].cantidad++;
        document.getElementById(`${id}-cantidad`).value = pedido[index].cantidad;
    } else {
        pedido.push({ id, titulo, precio, cantidad: 1 });
        document.getElementById(`${id}-cantidad`).value = 1;
    }
    document.getElementById('pedidoPopup').style.display = 'none';
    mostrarPedido();
}

function agregarCantidad(id) {
    const index = pedido.findIndex(item => item.id === id);
    if (index !== -1) {
        pedido[index].cantidad++;
        document.getElementById(`${id}-cantidad`).value = pedido[index].cantidad;
    }
    document.getElementById('pedidoPopup').style.display = 'none';
}

function quitarCantidad(id) {
    const index = pedido.findIndex(item => item.id === id);
    if (index !== -1 && pedido[index].cantidad > 0) {
        pedido[index].cantidad--;
        document.getElementById(`${id}-cantidad`).value = pedido[index].cantidad;
    }
}


function actualizarCantidad(id, nuevaCantidad) {
    const index = pedido.findIndex(item => item.id === id);
    if (index !== -1) {
        pedido[index].cantidad = parseInt(nuevaCantidad);
    }
}

// Agregar evento de escucha al campo de búsqueda
document.getElementById('inputBusqueda').addEventListener('input', function() {
    const filtro = this.value.toLowerCase();
    const platosFiltrados = menu.filter(plato => plato.titulo.toLowerCase().includes(filtro));
    mostrarPlatosFiltrados(platosFiltrados);
});

// Función para mostrar platos filtrados
function mostrarPlatosFiltrados(platos) {
    const menuDiv = document.querySelector('.menu');
    menuDiv.innerHTML = "";
    platos.forEach(plato => {
        const platoDiv = document.createElement('div');
        platoDiv.classList.add('col-md-4'); // Agregar clase para columnas Bootstrap
        platoDiv.innerHTML = generarPlatoHTML(plato);
        menuDiv.appendChild(platoDiv);
    });
}

mostrarPlatos();
