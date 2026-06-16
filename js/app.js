let rutas = JSON.parse(localStorage.getItem("rutas")) || [];
let contadorId = JSON.parse(localStorage.getItem("contadorId")) || 1;

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

function mostrarRutas() {
    contenedorRutas.innerHTML = "";
    rutas.forEach(ruta => {
        const card = document.createElement("route-card");
        card.setAttribute("ruta-id", ruta.id);
        card.setAttribute("nombre", ruta.nombre);
        card.setAttribute("conductor", ruta.conductor);
        card.setAttribute("hora", ruta.hora);
        card.setAttribute("ciudad", ruta.ciudad);

        ruta.estudiantes.forEach(est => {
            card.agregarEstudianteALista(est.id, est.nombre);
        });

        card.addEventListener("eliminarRuta", (e) => eliminarRuta(e.detail.id));
        card.addEventListener("editarRuta", (e) => editarRuta(e.detail.id));
        card.addEventListener("agregarEstudiante", (e) => agregarEstudiante(e.detail.idRuta, e.detail.nombre));
        card.addEventListener("eliminarEstudiante", (e) => eliminarEstudiante(e.detail.idRuta, e.detail.idEstudiante));

        contenedorRutas.appendChild(card);

        obtenerClima(ruta.ciudad).then(clima => {
            card.actualizarClima(clima);
        });
    });
}

function crearRuta(nombre, conductor, hora, ciudad) {
    const nuevaRuta = {
        id: contadorId++,
        nombre,
        conductor,
        hora,
        ciudad,
        estudiantes: []
    };
    rutas.push(nuevaRuta);
    guardarEnStorage();
    mostrarRutas();

    document.dispatchEvent(new CustomEvent("rutaCreada", {
        detail: { nombre: nuevaRuta.nombre }
    }));
}

function eliminarRuta(id) {
    rutas = rutas.filter(r => r.id != id);
    guardarEnStorage();
    mostrarRutas();
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
    }
}

function agregarEstudiante(idRuta, nombre) {
    const ruta = rutas.find(r => r.id == idRuta);
    if (!ruta) return;
    ruta.estudiantes.push({ id: Date.now(), nombre });
    guardarEnStorage();
    mostrarRutas();
}

function eliminarEstudiante(idRuta, idEstudiante) {
    const ruta = rutas.find(r => r.id == idRuta);
    if (!ruta) return;
    ruta.estudiantes = ruta.estudiantes.filter(e => e.id != idEstudiante);
    guardarEnStorage();
    mostrarRutas();
}

btnAgregarRuta.addEventListener("click", () => {
    const nombre = inputNombre.value.trim();
    const conductor = inputConductor.value.trim();
    const hora = inputHora.value.trim();
    const ciudad = inputCiudad.value.trim();

    if (nombre === "" || conductor === "" || hora === "" || ciudad === "") {
        alert("Por favor completa todos los campos");
        return;
    }

    crearRuta(nombre, conductor, hora, ciudad);

    inputNombre.value = "";
    inputConductor.value = "";
    inputHora.value = "";
    inputCiudad.value = "";
});

document.addEventListener("rutaCreada", (e) => {
    console.log("Ruta creada: ", e.detail.nombre);
});

mostrarRutas();