let rutas = JSON.parse(localStorage.getItem("rutas")) || [];
let contadorId = JSON.parse(localStorage.getItem("contadorId")) || 1;
let filtroActual = "todas";

const contenedorRutas = document.getElementById("contenedor-rutas");
const btnAgregarRuta = document.getElementById("btn-agregar-ruta");
const inputNombre = document.getElementById("input-nombre");
const inputConductor = document.getElementById("input-conductor");
const inputHora = document.getElementById("input-hora");
const inputCiudad = document.getElementById("input-ciudad");

function guardarEnStorage() {
    localStorage.setItem("rutas", JSON.stringify(rutas));
    localStorage.setItem("contadorId", JSON.stringify(contadorId));
}

function mostrarNotificacion(mensaje) {
    const notif = document.createElement("div");
    notif.className = "notificacion";
    notif.textContent = mensaje;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function actualizarEstadisticas() {
    const totalRutas = rutas.length;
    const totalEstudiantes = rutas.reduce((acc, ruta) => acc + ruta.estudiantes.length, 0);
    document.getElementById("total-rutas").textContent = totalRutas;
    document.getElementById("total-estudiantes").textContent = totalEstudiantes;
}

function renderizarRutas(lista) {
    contenedorRutas.innerHTML = "";
    lista.forEach(ruta => {
        const card = document.createElement("route-card");
        card.setAttribute("ruta-id", ruta.id);
        card.setAttribute("nombre", ruta.nombre);
        card.setAttribute("conductor", ruta.conductor);
        card.setAttribute("hora", ruta.hora);
        card.setAttribute("ciudad", ruta.ciudad);
        card.setAttribute("estado", ruta.estado || "pendiente");

        ruta.estudiantes.forEach(est => {
            card.agregarEstudianteALista(est.id, est.nombre);
        });

        card.addEventListener("eliminarRuta", (e) => eliminarRuta(e.detail.id));
        card.addEventListener("editarRuta", (e) => editarRuta(e.detail.id));
        card.addEventListener("agregarEstudiante", (e) => agregarEstudiante(e.detail.idRuta, e.detail.nombre));
        card.addEventListener("eliminarEstudiante", (e) => eliminarEstudiante(e.detail.idRuta, e.detail.idEstudiante));
        card.addEventListener("cambiarEstado", (e) => {
            const ruta = rutas.find(r => r.id == e.detail.idRuta);
            if (ruta) {
                ruta.estado = e.detail.estado;
                guardarEnStorage();
            }
        });

        contenedorRutas.appendChild(card);

        obtenerClima(ruta.ciudad).then(clima => {
            card.actualizarClima(clima);
        });
    });
    actualizarEstadisticas();
}

function mostrarRutas() {
    renderizarRutas(rutas);
}

function aplicarFiltros() {
    const termino = document.getElementById("buscador").value.trim().toLowerCase();
    let filtradas = rutas;

    if (filtroActual !== "todas") {
        filtradas = filtradas.filter(r => r.estado === filtroActual);
    }

    if (termino !== "") {
        filtradas = filtradas.filter(r =>
            r.nombre.toLowerCase().includes(termino) ||
            r.ciudad.toLowerCase().includes(termino)
        );
    }

    renderizarRutas(filtradas);
}

function crearRuta(nombre, conductor, hora, ciudad) {
    const nuevaRuta = {
        id: contadorId++,
        nombre,
        conductor,
        hora,
        ciudad,
        estado: "pendiente",
        estudiantes: []
    };
    rutas.push(nuevaRuta);
    guardarEnStorage();
    mostrarRutas();
    mostrarNotificacion("Ruta creada exitosamente");

    document.dispatchEvent(new CustomEvent("rutaCreada", {
        detail: { nombre: nuevaRuta.nombre }
    }));
}

function eliminarRuta(id) {
    rutas = rutas.filter(r => r.id != id);
    guardarEnStorage();
    mostrarRutas();
    mostrarNotificacion("Ruta eliminada");
}

function editarRuta(id) {
    const ruta = rutas.find(r => r.id == id);
    if (!ruta) return;

    const nuevoNombre = prompt("Nombre de la ruta:", ruta.nombre);
    const nuevoConductor = prompt("Conductor:", ruta.conductor);
    const nuevaHora = prompt("Hora de salida:", ruta.hora);
    const nuevaCiudad = prompt("Ciudad:", ruta.ciudad);

    if (nuevoNombre && nuevoConductor && nuevaHora && nuevaCiudad) {
        ruta.nombre = nuevoNombre;
        ruta.conductor = nuevoConductor;
        ruta.hora = nuevaHora;
        ruta.ciudad = nuevaCiudad;
        guardarEnStorage();
        mostrarRutas();
        mostrarNotificacion("Ruta actualizada");
    }
}

function agregarEstudiante(idRuta, nombre) {
    const ruta = rutas.find(r => r.id == idRuta);
    if (!ruta) return;
    ruta.estudiantes.push({ id: Date.now(), nombre });
    guardarEnStorage();
    mostrarRutas();
    mostrarNotificacion("Estudiante agregado");
}

function eliminarEstudiante(idRuta, idEstudiante) {
    const ruta = rutas.find(r => r.id == idRuta);
    if (!ruta) return;
    ruta.estudiantes = ruta.estudiantes.filter(e => e.id != idEstudiante);
    guardarEnStorage();
    mostrarRutas();
    mostrarNotificacion("Estudiante eliminado");
}

btnAgregarRuta.addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    const conductor = inputConductor.value.trim();
    const hora = inputHora.value.trim();
    const ciudad = inputCiudad.value.trim();

    if (nombre === "" || conductor === "" || hora === "" || ciudad === "") {
        mostrarNotificacion("Por favor completa todos los campos");
        return;
    }

    crearRuta(nombre, conductor, hora, ciudad);

    inputNombre.value = "";
    inputConductor.value = "";
    inputHora.value = "";
    inputCiudad.value = "";
});

document.querySelectorAll(".btn-filtro").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
        btn.classList.add("activo");
        filtroActual = btn.dataset.filtro;
        aplicarFiltros();
    });
});

document.getElementById("buscador").addEventListener("input", () => {
    aplicarFiltros();
});

document.addEventListener("rutaCreada", (e) => {
    console.log("Ruta creada: ", e.detail.nombre);
});

mostrarRutas();