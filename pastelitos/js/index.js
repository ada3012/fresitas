let precioActual = 0;
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const baseDatosProductos = {
    'Marcos': { 
        desc: 'Un pastelito súper innovador, renderizado con la mejor tecnología. Tiene un toque de overclock de energía ideal para rendir al máximo.',
        kcal: 450, peso: 180, ing: 'Harina, chocolate puro, gráficos de PC, chispas RGB.' 
    },
    'Jose Luis': { 
        desc: 'Es un pastelito dulce e inteligente a la vez. Su núcleo procesa el sabor de manera súper eficiente, dejándote con ganas de más.',
        kcal: 320, peso: 150, ing: 'Fresa, vainilla, crema batida, azúcar glass.' 
    },
    'Néstor': { 
        desc: 'Un modelo clásico y muy confiable. Tiene una memoria caché llena de texturas suaves y dulces que nunca fallan.',
        kcal: 380, peso: 160, ing: 'Chocolate con leche, nuez, relleno de dulce de leche.' 
    },
    'Adair': { 
        desc: 'El hardware más reciente de la tienda. Viene equipado con enfriamiento líquido de caramelo y un diseño exterior que roba miradas.',
        kcal: 410, peso: 170, ing: 'Caramelo, almendras, pan de chocolate oscuro y betún.' 
    }
};

function irAPago(nombre, precio, imagen) {
    precioActual = precio;

    document.getElementById('pago-titulo').innerText = nombre;
    document.getElementById('pago-precio').innerText = '$' + precio.toFixed(2);
    document.getElementById('precio-total').innerText = '$' + precio.toFixed(2);
    document.getElementById('cantidad').value = 1;
    document.querySelector('#pago-img img').src = imagen;

    let info = baseDatosProductos[nombre];
    if(info) {
        document.getElementById('info-descripcion').innerText = `"${info.desc}"`;
        document.getElementById('info-ingredientes').innerText = info.ing;
        document.getElementById('info-kcal').innerText = info.kcal;
        document.getElementById('info-peso').innerText = info.peso;
    }

    document.getElementById('vista-catalogo').style.display = 'none';
    document.getElementById('vista-carrito').style.display = 'none';
    document.getElementById('vista-pago').style.display = 'block';
}

function volverCatalogo() {
    document.getElementById('vista-pago').style.display = 'none';
    document.getElementById('vista-carrito').style.display = 'none';
    document.getElementById('vista-catalogo').style.display = 'block';
}

function cambiarCantidad(cambio) {
    let input = document.getElementById('cantidad');
    let nueva = parseInt(input.value) + cambio;

    if (nueva >= 1) {
        input.value = nueva;
        document.getElementById('precio-total').innerText = '$' + (nueva * precioActual).toFixed(2);
    }
}

function agregarDesdeDetalles(event) {
    let nombre = document.getElementById('pago-titulo').innerText;
    let imagenSrc = document.querySelector('#pago-img img').src;
    let cantidad = parseInt(document.getElementById('cantidad').value);

    animarAlCarrito(imagenSrc);

    let existe = carrito.find(p => p.nombre === nombre);
    if(existe){ existe.cantidad += cantidad; }
    else{ carrito.push({nombre, precio: precioActual, imagen: imagenSrc, cantidad}); }
    
    localStorage.setItem("carrito", JSON.stringify(carrito));

    let btn = event.target;
    let textoOriginal = btn.innerText;
    btn.innerText = "¡Agregado! ✔️";
    btn.style.background = "#2ac952";
    setTimeout(() => {
        btn.innerText = textoOriginal;
        btn.style.background = ""; 
    }, 1500);
}

function animarAlCarrito(imagenSrc) {
    let btnCarrito = document.querySelector('.btn-carrito-nav');
    let imgOriginal = document.querySelector('#pago-img img');
    
    let rectCarrito = btnCarrito.getBoundingClientRect();
    let rectImg = imgOriginal.getBoundingClientRect();

    let clon = document.createElement('img');
    clon.src = imagenSrc;
    clon.classList.add('animacion-volar');
    clon.style.top = rectImg.top + 'px';
    clon.style.left = rectImg.left + 'px';
    clon.style.width = rectImg.width + 'px';
    clon.style.height = rectImg.height + 'px';
    document.body.appendChild(clon);

    setTimeout(() => {
        clon.style.top = rectCarrito.top + 'px';
        clon.style.left = rectCarrito.left + 'px';
        clon.style.width = '20px';
        clon.style.height = '20px';
        clon.style.opacity = '0';
        clon.style.transform = 'scale(0.1)';
    }, 10);

    setTimeout(() => {
        clon.remove();
        btnCarrito.classList.add('shake-anim');
        setTimeout(() => btnCarrito.classList.remove('shake-anim'), 400);
    }, 800);
}

function verCarrito(){
    document.getElementById('vista-catalogo').style.display = 'none';
    document.getElementById('vista-pago').style.display = 'none';
    document.getElementById('vista-carrito').style.display = 'block';
    renderCarrito();
}

function renderCarrito(){
    let lista = document.getElementById('carrito-lista');
    lista.innerHTML="";
    let total=0;

    if(carrito.length === 0) {
        lista.innerHTML = "<p style='color: gray; text-align: center; margin-top: 20px;'>Tu carrito está vacío.</p>";
    }

    carrito.forEach((p,i)=>{
        total += p.precio*p.cantidad;
        lista.innerHTML += `
        <div class="carrito-item">
            <img src="${p.imagen}" width="60" height="60">
            <div class="info">
                <strong style="font-size: 16px;">${p.nombre}</strong><br>
                <small style="color: gray; font-size: 14px;">$${p.precio.toFixed(2)} c/u</small>
            </div>
            <div class="botones">
                <button onclick="cambiarCarrito(${i}, -1)">-</button>
                <span style="margin: 0 10px; font-weight: bold;">${p.cantidad}</span>
                <button onclick="cambiarCarrito(${i}, 1)">+</button>
            </div>
            <button class="btn-eliminar" onclick="eliminar(${i})">❌</button>
        </div>`;
    });

    document.getElementById('total-carrito').innerText="$" + total.toFixed(2);
}

function cambiarCarrito(i,c){
    carrito[i].cantidad += c;
    if(carrito[i].cantidad <= 0) carrito.splice(i,1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
}

function eliminar(i){
    carrito.splice(i,1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
}

function toggleTarjeta(mostrar) {
    document.getElementById('form-tarjeta').style.display = mostrar ? 'block' : 'none';
}

// GENERACIÓN DEL TICKET 
function pagarCarrito() {
    if(carrito.length === 0) {
        alert("¡Tu carrito está vacío! Agrega unos pastelitos primero.");
        return;
    }

    let nombre = document.getElementById('nombre-cliente').value;
    if(nombre.trim() === "") {
        alert("⚠️ Por favor, ingresa tu nombre para personalizar el ticket.");
        document.getElementById('nombre-cliente').focus();
        return;
    }

    // 1. Llenamos los datos en la plantilla oculta del PDF
    document.getElementById('pdf-nombre-cliente').innerText = nombre;
    document.getElementById('pdf-total').innerText = document.getElementById('total-carrito').innerText;
    
    let listaPdf = document.getElementById('pdf-lista-productos');
    listaPdf.innerHTML = ""; // Limpiar lista
    
    carrito.forEach(p => {
        listaPdf.innerHTML += `
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #222;">
                <div style="display:flex; align-items:center;">
                    <img src="${p.imagen}" style="width: 30px; height: 30px; border-radius:5px; margin-right:10px;">
                    ${p.nombre}
                </div>
            </td>
            <td style="text-align: center; border-bottom: 1px solid #222;">${p.cantidad}</td>
            <td style="text-align: right; border-bottom: 1px solid #222;">$${(p.precio * p.cantidad).toFixed(2)}</td>
        </tr>`;
    });

    // 2. Configuramos html2pdf
    let elemento = document.getElementById('ticket-pdf-template');
    elemento.style.display = "block"; // Lo mostramos temporalmente para la foto

    let opciones = {
        margin:       10,
        filename:     `Ticket_HardwareCake_${nombre}.pdf`,
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { scale: 2, useCORS: true }, // useCORS permite cargar imágenes externas como el QR
        jsPDF:        { unit: 'mm', format: 'a5', orientation: 'portrait' }
    };

    // 3. Generamos el PDF
    html2pdf().set(opciones).from(elemento).save().then(() => {
        elemento.style.display = "none"; // Lo volvemos a ocultar
        
        alert(`¡Compra procesada, ${nombre}!  \n\nTu ticket digital se está descargando.`);
        
        // Limpiamos el carrito
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        document.getElementById('nombre-cliente').value = ""; 
        renderCarrito();
        volverCatalogo();
    });
}

function buscarProducto(){
    let input = document.querySelector(".search-bar").value.toLowerCase();
    let productos = document.querySelectorAll(".producto-card");

    productos.forEach(p => {
        let nombre = p.querySelector("h3").innerText.toLowerCase();
        p.style.display = nombre.includes(input) ? "" : "none";
    });
}