const template = document.createElement("template");
template.innerHTML = `
<style>
    .card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin: 10px;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .card-titulo {
        font-size: 20px;
        font-weight: bold;
        color: #1a73e8;
    }
    .card-info p {
        margin: 5px 0;
        color: #555;
    }
    .clima {
        background: #e8f4fd;
        padding: 8px;
        border-radius: 8px;
        margin: 10px 0;
    }
    .estudiantes-lista {
        list-style: none;
        padding: 0;
    }
    .estudiantes-lista li {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
    }
    .btn-eliminar-estudiante {
        background: none;
        border: none;
        color: red;
        cursor: pointer;
    }
    .input-estudiante {
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 6px;
        margin-right: 5px;
    }
    .btn-agregar-estudiante {
        background: #1a73e8;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
    }
    .acciones {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
    .btn-editar {
        background: #f9a825;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
    }
    .btn-eliminar {
        background: #e53935;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
    }
</style>

<div class="card">
    <div class="card-header">
        <span class="card-titulo"></span>
    </div>
    <div class="card-info">
        <p class="conductor"></p>
        <p class="hora"></p>
        <p class="ciudad"></p>
    </div>
    <div class="clima">Cargando clima...</div>
    <h4>Estudiantes:</h4>
    <ul class="estudiantes-lista"></ul>
    <div class="agregar-estudiante">
        <input class="input-estudiante" type="text" placeholder="Nombre del estudiante">
        <button class="btn-agregar-estudiante">+ Agregar</button>
    </div>
    <div class="acciones">
        <button class="btn-editar">✏️ Editar</button>
        <button class="btn-eliminar">🗑️ Eliminar</button>
    </div>
</div>
`;

class RouteCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const nombre = this.getAttribute("nombre");
        const conductor = this.getAttribute("conductor");
        const hora = this.getAttribute("hora");
        const ciudad = this.getAttribute("ciudad");

        this.shadowRoot.querySelector(".card-titulo").textContent = "🚌 " + nombre;
        this.shadowRoot.querySelector(".conductor").textContent = "👤 Conductor: " + conductor;
        this.shadowRoot.querySelector(".hora").textContent = "🕐 Hora: " + hora;
        this.shadowRoot.querySelector(".ciudad").textContent = "📍 Ciudad: " + ciudad;

        this.shadowRoot.querySelector(".btn-eliminar").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("eliminarRuta", {
                bubbles: true,
                composed: true,
                detail: { id: this.getAttribute("ruta-id") }
            }));
        });

        this.shadowRoot.querySelector(".btn-editar").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("editarRuta", {
                bubbles: true,
                composed: true,
                detail: { id: this.getAttribute("ruta-id") }
            }));
        });

        this.shadowRoot.querySelector(".btn-agregar-estudiante").addEventListener("click", () => {
            const input = this.shadowRoot.querySelector(".input-estudiante");
            const nombre = input.value.trim();
            if (nombre !== "") {
                this.dispatchEvent(new CustomEvent("agregarEstudiante", {
                    bubbles: true,
                    composed: true,
                    detail: {
                        idRuta: this.getAttribute("ruta-id"),
                        nombre: nombre
                    }
                }));
                input.value = "";
            }
        });
    }

    agregarEstudianteALista(id, nombre) {
        const lista = this.shadowRoot.querySelector(".estudiantes-lista");
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${nombre}</span>
            <button class="btn-eliminar-estudiante">✕</button>
        `;
        li.querySelector(".btn-eliminar-estudiante").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("eliminarEstudiante", {
                bubbles: true,
                composed: true,
                detail: { idRuta: this.getAttribute("ruta-id"), idEstudiante: id }
            }));
            li.remove();
        });
        lista.appendChild(li);
    }

    actualizarClima(texto) {
        this.shadowRoot.querySelector(".clima").textContent = texto;
    }
}

customElements.define("route-card", RouteCard);