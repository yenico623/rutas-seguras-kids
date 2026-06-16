const template = document.createElement("template");
template.innerHTML = `
<style>
    * {
        font-family: 'Inter', sans-serif;
        box-sizing: border-box;
    }
    .card {
        background: white;
        border-radius: 10px;
        padding: 16px;
        box-shadow: 0 1px 8px rgba(0,0,0,0.08);
        border: 1px solid #e2e8f0;
        transition: box-shadow 0.2s;
    }
    .card:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }
    .card-titulo {
        font-size: 0.95rem;
        font-weight: 600;
        color: #1e3a5f;
        margin-bottom: 8px;
    }
    .card-info p {
        margin: 3px 0;
        color: #64748b;
        font-size: 0.8rem;
    }
    .clima {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 6px 10px;
        border-radius: 6px;
        margin: 10px 0;
        color: #475569;
        font-size: 0.78rem;
    }
    h4 {
        font-size: 0.7rem;
        font-weight: 600;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        margin: 10px 0 6px;
    }
    .estudiantes-lista {
        list-style: none;
        padding: 0;
    }
    .estudiantes-lista li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        border-bottom: 1px solid #f1f5f9;
        font-size: 0.8rem;
        color: #334155;
    }
    .btn-eliminar-estudiante {
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        font-size: 0.75rem;
        padding: 2px 6px;
        border-radius: 4px;
        transition: all 0.2s;
    }
    .btn-eliminar-estudiante:hover {
        background: #fee2e2;
        color: #dc2626;
    }
    .agregar-estudiante {
        display: flex;
        margin: 10px 0;
        gap: 6px;
    }
    .input-estudiante {
        padding: 6px 10px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        font-size: 0.78rem;
        color: #334155;
        background: #f8fafc;
        flex: 1;
    }
    .input-estudiante:focus {
        outline: none;
        border-color: #2563eb;
    }
    .btn-agregar-estudiante {
        background: #1e3a5f;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.78rem;
        font-weight: 500;
        transition: all 0.2s;
    }
    .btn-agregar-estudiante:hover {
        background: #2563eb;
    }
    .acciones {
        display: flex;
        gap: 8px;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #f1f5f9;
    }
    .btn-editar {
        background: #2563eb;
        color: white;
        border: none;
        padding: 6px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.78rem;
        font-weight: 500;
        transition: all 0.2s;
    }
    .btn-editar:hover {
        background: #1d4ed8;
    }
    .btn-eliminar {
        background: white;
        color: #dc2626;
        border: 1px solid #dc2626;
        padding: 6px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.78rem;
        font-weight: 500;
        transition: all 0.2s;
    }
    .btn-eliminar:hover {
        background: #dc2626;
        color: white;
    }
    .badge-estado {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 20px;
        font-size: 0.68rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        margin-bottom: 8px;
    }
    .estado-pendiente {
        background: #fef9c3;
        color: #854d0e;
    }
    .estado-en-curso {
        background: #dcfce7;
        color: #166534;
    }
    .estado-finalizada {
        background: #f1f5f9;
        color: #475569;
    }
    .selector-estado {
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 0.75rem;
        font-family: 'Inter', sans-serif;
        color: #334155;
        background: #f8fafc;
        cursor: pointer;
        margin-bottom: 8px;
    }
</style>

<div class="card">
    <span class="badge-estado estado-pendiente">Pendiente</span>
    <div class="card-titulo"></div>
    <div class="card-info">
        <p class="conductor"></p>
        <p class="hora"></p>
        <p class="ciudad"></p>
    </div>
    <div class="clima">Cargando clima...</div>
    <select class="selector-estado">
        <option value="pendiente">Pendiente</option>
        <option value="en-curso">En curso</option>
        <option value="finalizada">Finalizada</option>
    </select>
    <h4>Estudiantes</h4>
    <ul class="estudiantes-lista"></ul>
    <div class="agregar-estudiante">
        <input class="input-estudiante" type="text" placeholder="Nombre del estudiante">
        <button class="btn-agregar-estudiante">Agregar</button>
    </div>
    <div class="acciones">
        <button class="btn-editar">Editar</button>
        <button class="btn-eliminar">Eliminar</button>
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
        const estado = this.getAttribute("estado") || "pendiente";

        this.shadowRoot.querySelector(".card-titulo").textContent = nombre;
        this.shadowRoot.querySelector(".conductor").textContent = "Conductor: " + conductor;
        this.shadowRoot.querySelector(".hora").textContent = "Hora: " + hora;
        this.shadowRoot.querySelector(".ciudad").textContent = "Ciudad: " + ciudad;

        const badge = this.shadowRoot.querySelector(".badge-estado");
        const selector = this.shadowRoot.querySelector(".selector-estado");

        this._actualizarBadge(badge, estado);
        selector.value = estado;

        selector.addEventListener("change", () => {
            const nuevoEstado = selector.value;
            this._actualizarBadge(badge, nuevoEstado);
            this.dispatchEvent(new CustomEvent("cambiarEstado", {
                bubbles: true,
                composed: true,
                detail: { idRuta: this.getAttribute("ruta-id"), estado: nuevoEstado }
            }));
        });

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
                    detail: { idRuta: this.getAttribute("ruta-id"), nombre }
                }));
                input.value = "";
            }
        });
    }

    _actualizarBadge(badge, estado) {
        badge.className = "badge-estado";
        const estados = {
            "pendiente": { clase: "estado-pendiente", texto: "Pendiente" },
            "en-curso": { clase: "estado-en-curso", texto: "En curso" },
            "finalizada": { clase: "estado-finalizada", texto: "Finalizada" }
        };
        const info = estados[estado] || estados["pendiente"];
        badge.classList.add(info.clase);
        badge.textContent = info.texto;
    }

    agregarEstudianteALista(id, nombre) {
        const lista = this.shadowRoot.querySelector(".estudiantes-lista");
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${nombre}</span>
            <button class="btn-eliminar-estudiante">Eliminar</button>
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