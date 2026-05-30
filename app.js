// ============================================================
//  app.js — DosisPed · Calculadora pediátrica
//  Adaptado de Perfusiones UCI · soporte oral/IV intermitente,
//  perfusión continua, carga/mantenimiento y dosis puntual.
// ============================================================

/* jshint esversion: 11 */

// ── Constantes ─────────────────────────────────────────────
const KEY_TEMA      = "dosisped-tema";
const KEY_PESO      = "dosisped-peso";
const KEY_EDAD      = "dosisped-edad";
const KEY_EDAD_UN   = "dosisped-edad-unidad";
const KEY_NEONATO   = "dosisped-neonato";
const KEY_EG        = "dosisped-eg";
const KEY_EPN       = "dosisped-epn";
const KEY_FAV       = "dosisped-favoritos";
const KEY_BIENV     = "dosisped-bienvenida-vista";
const KEY_ULTIMO    = "dosisped-ultimo-farmaco";
const KEY_HIST      = "dosisped-historial";
const KEY_PAC_RX    = "dosisped-paciente-rx";
const KEY_VERSION   = "dosisped-version-vista";

// ── Versión y novedades (changelog) ────────────────────────
// APP_VERSION = id de la versión más reciente (debe coincidir con NOVEDADES[0].version).
// Al añadir una versión, insertar su entrada AL PRINCIPIO del array y actualizar APP_VERSION.
const APP_VERSION = "2026.07";

// Clave de acceso de Web3Forms para el buzón de sugerencias.
// Obtenida en web3forms.com con el correo del autor (el correo NO aparece aquí).
const WEB3FORMS_KEY = "f57ce774-9fbd-471e-b52d-7c3aa180094e";

// Changelog: entradas de la MÁS RECIENTE (arriba) a la más antigua.
// Al publicar mejoras, añadir una entrada AL PRINCIPIO y actualizar APP_VERSION = NOVEDADES[0].version.
const NOVEDADES = [
  {
    version: "2026.07",
    fecha: "Junio 2026",
    titulo: "Buzón de sugerencias",
    cambios: [
      "Nuevo buzón de sugerencias: desde «Acerca de» (botón ⓘ) puedes enviar comentarios, proponer fármacos o avisar de un posible error de dosis.",
      "Puedes escribir de forma anónima o dejar tu email si quieres respuesta. No se recoge ningún dato del paciente."
    ]
  },
  {
    version: "2026.06",
    fecha: "Junio 2026",
    titulo: "Búsqueda inteligente y 17 fármacos nuevos",
    cambios: [
      "Búsqueda por indicación: escribe «meningitis», «candidiasis» o «epistaxis» y verás los fármacos relevantes, no solo por su nombre.",
      "La búsqueda ahora ignora acentos y ordena los resultados por relevancia, mostrando dónde coincide cada término.",
      "Nuevo botón ✕ para limpiar la búsqueda al instante (o pulsa la tecla Escape).",
      "17 fármacos nuevos: morfina, EMLA (anestésico para punciones), racecadotrilo, sales de rehidratación oral, ácido tranexámico, suero salino hipertónico 3 %, manitol, deflazacort, loratadina, lorazepam, naproxeno y más.",
      "Ya son 148 fármacos, todos verificados con Pediamécum (AEP)."
    ]
  }
];

// ── Tema claro/oscuro ──────────────────────────────────────
(function () {
  const btnTema   = document.getElementById("btn-tema");
  const root      = document.documentElement;
  const metaTheme = document.getElementById("meta-theme-color");

  const iconLuna = btnTema.querySelector(".icon-luna");
  const iconSol  = btnTema.querySelector(".icon-sol");

  function aplicarTema(claro) {
    if (claro) {
      root.classList.add("modo-claro");
      iconLuna.style.display = "none";
      iconSol.style.display  = "block";
      if (metaTheme) metaTheme.content = "#f0f7fb";
    } else {
      root.classList.remove("modo-claro");
      iconLuna.style.display = "block";
      iconSol.style.display  = "none";
      if (metaTheme) metaTheme.content = "#0d1b2a";
    }
  }

  const guardado  = localStorage.getItem(KEY_TEMA);
  const prefClaro = window.matchMedia("(prefers-color-scheme: light)").matches;
  aplicarTema(guardado !== null ? guardado === "claro" : prefClaro);

  btnTema.addEventListener("click", () => {
    const esClaro = root.classList.contains("modo-claro");
    aplicarTema(!esClaro);
    localStorage.setItem(KEY_TEMA, !esClaro ? "claro" : "oscuro");
  });
})();

// ── Estado global ──────────────────────────────────────────
let pesoActual        = null;
let edadValor         = null;     // valor numérico
let edadUnidad        = "anios";  // "anios" | "meses" | "dias"
let modoNeonato       = false;
let egSemanas         = null;     // edad gestacional
let epnDias           = null;     // edad postnatal

let farmSeleccionado  = null;
let presIndex         = 0;        // índice de presentación (modos perfusión)
let intIndex          = 0;        // índice de pauta intermitente
let prepIndex         = 0;        // índice de preparado comercial activo
let modoCalculo       = "dosis";
let modoAdmin         = "intermitente";
let factorInt         = 1.0;       // factor de ajuste fino (0.5–1.5) en modo intermitente
let categoriaFiltro   = "Todos";
let clinicaTab        = "indicaciones";
let clinicaAbierta    = false;
let favoritos         = new Set(JSON.parse(localStorage.getItem(KEY_FAV) || "[]"));

// ── Inicialización ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  cargarPacienteDeStorage();
  construirFiltros();
  renderizarLista();
  bindPaciente();
  bindNeonato();
  bindBusqueda();
  bindModales();

  document.getElementById("btn-calcular").addEventListener("click", calcular);
  document.getElementById("btn-limpiar").addEventListener("click", limpiarCalc);
  document.getElementById("panel-overlay").addEventListener("click", cerrarPanel);
  document.getElementById("btn-favorito").addEventListener("click", () => {
    if (!farmSeleccionado) return;
    toggleFavorito(farmSeleccionado.nombre);
  });

  // Vista paciente
  document.getElementById("btn-paciente").addEventListener("click", abrirModalPaciente);
  document.getElementById("btn-cerrar-paciente").addEventListener("click", () => {
    document.getElementById("modal-paciente").style.display = "none";
  });
  document.getElementById("modal-paciente").addEventListener("click", e => {
    if (e.target.id === "modal-paciente") document.getElementById("modal-paciente").style.display = "none";
  });
  document.getElementById("btn-paciente-copiar").addEventListener("click", copiarPrescripcion);
  document.getElementById("btn-paciente-vaciar").addEventListener("click", () => {
    if (leerPacienteRx().length === 0) return;
    if (confirm("¿Vaciar toda la prescripción actual? Los datos del paciente (peso, edad) se mantienen.")) {
      localStorage.removeItem(KEY_PAC_RX);
      actualizarBadgePaciente();
      renderModalPaciente();
    }
  });
  document.getElementById("btn-paciente-nuevo").addEventListener("click", nuevoPaciente);
  document.getElementById("btn-paciente-imprimir").addEventListener("click", imprimirPrescripcion);
  document.getElementById("btn-paciente-compartir").addEventListener("click", compartirPrescripcionUrl);
  document.getElementById("btn-add-paciente").addEventListener("click", () => {
    if (!farmSeleccionado) return;
    agregarAPaciente();
  });

  // Historial
  document.getElementById("btn-historial").addEventListener("click", e => {
    e.stopPropagation();
    toggleHistorial();
  });
  document.getElementById("historial-clear").addEventListener("click", e => {
    e.stopPropagation();
    sessionStorage.removeItem(KEY_HIST);
    renderHistorial();
  });
  document.addEventListener("click", e => {
    const drop = document.getElementById("historial-dropdown");
    const btn  = document.getElementById("btn-historial");
    if (drop.style.display === "block" && !drop.contains(e.target) && e.target !== btn) {
      drop.style.display = "none";
    }
  });

  document.getElementById("valor-input").addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); calcular(); }
  });

  document.getElementById("btn-info-toggle").addEventListener("click", () => {
    document.getElementById("info-collapse").classList.toggle("info-collapse--abierto");
  });

  document.getElementById("btn-clinica-toggle").addEventListener("click", () => {
    clinicaAbierta = !clinicaAbierta;
    const body    = document.getElementById("clinica-body");
    const chevron = document.getElementById("clinica-chevron");
    body.style.display      = clinicaAbierta ? "flex" : "none";
    chevron.style.transform = clinicaAbierta ? "rotate(180deg)" : "";
  });

  document.getElementById("clinica-tabs").addEventListener("click", e => {
    const btn = e.target.closest(".clinica-tab");
    if (!btn) return;
    clinicaTab = btn.dataset.tab;
    document.querySelectorAll(".clinica-tab").forEach(b => b.classList.remove("clinica-tab--activa"));
    btn.classList.add("clinica-tab--activa");
    renderContenidoClinica();
  });

  // Service Worker (PWA) + banner de actualización automático
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(reg => {
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          // Mostrar banner solo si ya había una versión activa (no en la primera instalación)
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            mostrarBannerActualizacion(reg);
          }
        });
      });
    }).catch(function() {});

    let recargando = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (recargando) return;
      recargando = true;
      window.location.reload();
    });
  }

  function mostrarBannerActualizacion(reg) {
    const b = document.createElement("div");
    b.id = "update-banner";
    b.style.cssText = [
      "position:fixed", "bottom:24px", "left:50%",
      "transform:translateX(-50%)",
      "background:var(--cyan)", "color:#fff",
      "padding:12px 18px", "border-radius:24px",
      "font:600 0.88rem var(--font,system-ui,sans-serif)",
      "box-shadow:0 8px 24px rgba(0,0,0,.35)",
      "z-index:9999", "display:flex", "gap:12px", "align-items:center",
      "max-width:calc(100vw - 32px)", "white-space:nowrap"
    ].join(";");
    b.innerHTML =
      "<span>Nueva versión disponible</span>" +
      "<button style=\"background:rgba(255,255,255,0.22);color:#fff;border:1px solid rgba(255,255,255,0.35);" +
      "border-radius:14px;padding:6px 14px;font:700 0.82rem inherit;cursor:pointer;" +
      "-webkit-appearance:none;appearance:none;\">Actualizar</button>";
    b.querySelector("button").onclick = function () {
      if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
      b.remove();
    };
    document.body.appendChild(b);
  }

  // Modal de bienvenida (primer arranque)
  var bienvenidaVisible = false;
  if (!localStorage.getItem(KEY_BIENV)) {
    document.getElementById("modal-bienvenida").style.display = "flex";
    bienvenidaVisible = true;
  }

  // Restaurar último fármaco abierto
  const ultimoNombre = localStorage.getItem(KEY_ULTIMO);
  if (ultimoNombre) {
    const f = farmacos.find(function(x) { return x.nombre === ultimoNombre; });
    if (f) seleccionarFarmaco(f);
  }

  actualizarBadgePaciente();

  // Si la URL trae ?rx=... cargar prescripción compartida
  importarPrescripcionDesdeUrl();

  // Novedades de versión (changelog)
  bindNovedades();
  gestionarNovedades(bienvenidaVisible);

  // Buzón de sugerencias
  bindSugerencias();
});

// ============================================================
//  PACIENTE: peso, edad, modo neonato
// ============================================================
function cargarPacienteDeStorage() {
  const p = localStorage.getItem(KEY_PESO);
  if (p) {
    const v = parseFloat(p);
    if (v > 0 && v <= 200) pesoActual = v;
  }
  const e = localStorage.getItem(KEY_EDAD);
  if (e) {
    const v = parseFloat(e);
    if (v >= 0) edadValor = v;
  }
  const eu = localStorage.getItem(KEY_EDAD_UN);
  if (eu) edadUnidad = eu;

  if (localStorage.getItem(KEY_NEONATO) === "true") {
    modoNeonato = true;
    document.getElementById("btn-neonato").classList.add("btn-neonato--activo");
    document.getElementById("neonato-panel").style.display = "block";
    const eg = localStorage.getItem(KEY_EG);
    const ep = localStorage.getItem(KEY_EPN);
    if (eg) egSemanas = parseFloat(eg);
    if (ep) epnDias  = parseFloat(ep);
  }

  // Pintar inputs
  ["peso-input", "peso-panel-input"].forEach(function(id) {
    const el = document.getElementById(id);
    if (el && pesoActual !== null) el.value = String(pesoActual).replace(".", ",");
  });
  ["edad-input", "edad-panel-input"].forEach(function(id) {
    const el = document.getElementById(id);
    if (el && edadValor !== null) el.value = String(edadValor).replace(".", ",");
  });
  ["edad-unidad", "edad-panel-unidad"].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.value = edadUnidad;
  });
  if (egSemanas !== null) document.getElementById("eg-input").value = String(egSemanas).replace(".", ",");
  if (epnDias !== null)   document.getElementById("epn-input").value = String(epnDias).replace(".", ",");
}

function bindPaciente() {
  const pesoIds = ["peso-input", "peso-panel-input"];
  const edadIds = ["edad-input", "edad-panel-input"];
  const uniIds  = ["edad-unidad", "edad-panel-unidad"];

  pesoIds.forEach(function(id) {
    const inp = document.getElementById(id);
    if (!inp) return;
    inp.addEventListener("input", function() {
      const v = parseFloat(inp.value.replace(",", "."));
      pesoActual = (v > 0 && v <= 200) ? v : null;
      pesoIds.forEach(function(o) { if (o !== id) { const e = document.getElementById(o); if (e) e.value = inp.value; } });
      if (pesoActual !== null) localStorage.setItem(KEY_PESO, String(pesoActual));
      else localStorage.removeItem(KEY_PESO);
      onPacienteCambio();
    });
  });

  edadIds.forEach(function(id) {
    const inp = document.getElementById(id);
    if (!inp) return;
    inp.addEventListener("input", function() {
      const v = parseFloat(inp.value.replace(",", "."));
      edadValor = (v >= 0) ? v : null;
      edadIds.forEach(function(o) { if (o !== id) { const e = document.getElementById(o); if (e) e.value = inp.value; } });
      if (edadValor !== null) localStorage.setItem(KEY_EDAD, String(edadValor));
      else localStorage.removeItem(KEY_EDAD);
      onPacienteCambio();
    });
  });

  uniIds.forEach(function(id) {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.addEventListener("change", function() {
      edadUnidad = sel.value;
      uniIds.forEach(function(o) { if (o !== id) { const e = document.getElementById(o); if (e) e.value = edadUnidad; } });
      localStorage.setItem(KEY_EDAD_UN, edadUnidad);
      onPacienteCambio();
    });
  });
}

function bindNeonato() {
  const btn = document.getElementById("btn-neonato");
  const panel = document.getElementById("neonato-panel");
  const cerrar = document.getElementById("btn-cerrar-neo");
  const egInp = document.getElementById("eg-input");
  const epnInp = document.getElementById("epn-input");

  btn.addEventListener("click", function() {
    modoNeonato = !modoNeonato;
    btn.classList.toggle("btn-neonato--activo", modoNeonato);
    panel.style.display = modoNeonato ? "block" : "none";
    localStorage.setItem(KEY_NEONATO, modoNeonato ? "true" : "false");
    if (modoNeonato && edadValor === null) {
      edadValor = 0; edadUnidad = "dias";
      ["edad-input", "edad-panel-input"].forEach(function(id) { const e = document.getElementById(id); if (e) e.value = "0"; });
      ["edad-unidad", "edad-panel-unidad"].forEach(function(id) { const e = document.getElementById(id); if (e) e.value = "dias"; });
      localStorage.setItem(KEY_EDAD, "0");
      localStorage.setItem(KEY_EDAD_UN, "dias");
    }
    onPacienteCambio();
  });

  cerrar.addEventListener("click", function() {
    modoNeonato = false;
    btn.classList.remove("btn-neonato--activo");
    panel.style.display = "none";
    localStorage.setItem(KEY_NEONATO, "false");
    onPacienteCambio();
  });

  egInp.addEventListener("input", function() {
    const v = parseFloat(egInp.value.replace(",", "."));
    egSemanas = (v >= 22 && v <= 45) ? v : null;
    if (egSemanas !== null) localStorage.setItem(KEY_EG, String(egSemanas));
    else localStorage.removeItem(KEY_EG);
    onPacienteCambio();
  });
  epnInp.addEventListener("input", function() {
    const v = parseFloat(epnInp.value.replace(",", "."));
    epnDias = (v >= 0 && v <= 60) ? v : null;
    if (epnDias !== null) localStorage.setItem(KEY_EPN, String(epnDias));
    else localStorage.removeItem(KEY_EPN);
    onPacienteCambio();
  });
}

function onPacienteCambio() {
  if (!farmSeleccionado) return;
  renderPanel();
}

// Devuelve edad en meses (estimación) para comparaciones internas
function edadEnMeses() {
  if (edadValor === null) return null;
  if (edadUnidad === "anios") return edadValor * 12;
  if (edadUnidad === "meses") return edadValor;
  if (edadUnidad === "dias")  return edadValor / 30.4375;
  return null;
}

// ============================================================
//  MODALES
// ============================================================
function bindModales() {
  const overlay = document.getElementById("modal-bienvenida");
  const fuentes = document.getElementById("modal-fuentes");

  document.getElementById("btn-modal-aceptar").addEventListener("click", function() {
    const noRepetir = document.getElementById("modal-no-repetir").checked;
    if (noRepetir) localStorage.setItem(KEY_BIENV, "1");
    overlay.style.display = "none";
  });
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) {
      // sólo cerrar pulsando el botón; clic en overlay sólo lo cierra si ya se aceptó antes
      if (localStorage.getItem(KEY_BIENV)) overlay.style.display = "none";
    }
  });

  document.getElementById("btn-info-app").addEventListener("click", function() {
    fuentes.style.display = "flex";
  });
  document.getElementById("btn-cerrar-fuentes").addEventListener("click", function() {
    fuentes.style.display = "none";
  });
  fuentes.addEventListener("click", function(e) { if (e.target === fuentes) fuentes.style.display = "none"; });

  // Al abrir "Acerca de", pintar el historial de versiones
  document.getElementById("btn-info-app").addEventListener("click", renderHistorialVersiones);
}

// ============================================================
//  NOVEDADES / CHANGELOG
// ============================================================
function esUsuarioExistente() {
  // Indica si el usuario ya había usado la app antes (tiene datos guardados)
  return !!(localStorage.getItem(KEY_BIENV) || localStorage.getItem(KEY_TEMA) ||
            localStorage.getItem(KEY_PESO) || localStorage.getItem(KEY_FAV) ||
            localStorage.getItem(KEY_VERSION) || localStorage.getItem(KEY_HIST));
}

function bindNovedades() {
  const campana = document.getElementById("btn-novedades");
  if (campana) campana.addEventListener("click", function() { abrirModalNovedades(); });
  const cerrar = document.getElementById("btn-cerrar-novedades");
  if (cerrar) cerrar.addEventListener("click", cerrarModalNovedades);
  const aceptar = document.getElementById("btn-novedades-ok");
  if (aceptar) aceptar.addEventListener("click", cerrarModalNovedades);
  const overlay = document.getElementById("modal-novedades");
  if (overlay) overlay.addEventListener("click", function(e) { if (e.target === overlay) cerrarModalNovedades(); });
}

// Decide al arrancar si activar campana y/o mostrar el modal automáticamente
function gestionarNovedades(bienvenidaVisible) {
  const versionVista = localStorage.getItem(KEY_VERSION);
  if (versionVista === APP_VERSION) return; // al día, sin novedades

  if (!esUsuarioExistente()) {
    // Usuario totalmente nuevo: no mostramos changelog (todo es nuevo para él)
    localStorage.setItem(KEY_VERSION, APP_VERSION);
    return;
  }

  // Usuario existente con novedades sin leer → campana encendida
  activarCampana(true);
  // Modal automático, salvo que coincida con el modal de bienvenida (no solapar)
  if (!bienvenidaVisible) {
    setTimeout(function() { abrirModalNovedades(); }, 400);
  }
}

function activarCampana(activa) {
  const campana = document.getElementById("btn-novedades");
  if (!campana) return;
  campana.classList.toggle("btn-novedades--activa", !!activa);
  campana.style.display = activa ? "flex" : "none";
}

// Devuelve las entradas de NOVEDADES más nuevas que la última versión vista.
// Si no hay versión vista o no se reconoce, devuelve todas.
function novedadesNoVistas(versionVista) {
  if (!versionVista) return NOVEDADES.slice();
  var idx = NOVEDADES.findIndex(function(n) { return n.version === versionVista; });
  if (idx === -1) return NOVEDADES.slice();
  return NOVEDADES.slice(0, idx);
}

function abrirModalNovedades() {
  const cont = document.getElementById("modal-novedades-body");
  const sub = document.querySelector("#modal-novedades .modal-subtitulo");
  const versionVista = localStorage.getItem(KEY_VERSION);
  // Mostrar todas las novedades acumuladas desde la última visita; si no hay, la más reciente
  var lista = novedadesNoVistas(versionVista);
  if (lista.length === 0) lista = [NOVEDADES[0]];

  if (sub) {
    sub.textContent = lista.length > 1
      ? "Esto es lo nuevo desde tu última visita"
      : "Gracias por mantener la app al día";
  }
  if (cont) {
    cont.innerHTML = lista.map(function(nov) {
      return '<div class="novedades-bloque">' +
        '<div class="novedades-version">' + escHtml(nov.titulo) + '</div>' +
        '<div class="novedades-fecha">Versión ' + escHtml(nov.version) + ' · ' + escHtml(nov.fecha) + '</div>' +
        '<ul class="novedades-lista">' +
          nov.cambios.map(function(c) { return '<li>' + escHtml(c) + '</li>'; }).join("") +
        '</ul>' +
      '</div>';
    }).join("");
  }
  document.getElementById("modal-novedades").style.display = "flex";
}

function cerrarModalNovedades() {
  document.getElementById("modal-novedades").style.display = "none";
  // Marcar como leído: apagar campana y registrar versión vista
  localStorage.setItem(KEY_VERSION, APP_VERSION);
  activarCampana(false);
}

// Pinta el historial completo de versiones en el modal "Acerca de"
function renderHistorialVersiones() {
  const cont = document.getElementById("historial-versiones");
  if (!cont) return;
  cont.innerHTML = NOVEDADES.map(function(nov) {
    return '<div class="historial-version-item">' +
      '<div class="historial-version-cab"><b>' + escHtml(nov.titulo) + '</b>' +
        '<span class="historial-version-tag">v' + escHtml(nov.version) + ' · ' + escHtml(nov.fecha) + '</span></div>' +
      '<ul class="historial-version-cambios">' +
        nov.cambios.map(function(c) { return '<li>' + escHtml(c) + '</li>'; }).join("") +
      '</ul></div>';
  }).join("");
}

// ============================================================
//  BUZÓN DE SUGERENCIAS (Web3Forms)
// ============================================================
function bindSugerencias() {
  const abrir = document.getElementById("btn-abrir-sugerencias");
  const cerrar = document.getElementById("btn-cerrar-sugerencias");
  const overlay = document.getElementById("modal-sugerencias");
  const form = document.getElementById("form-sugerencias");
  const fuentes = document.getElementById("modal-fuentes");

  if (abrir) abrir.addEventListener("click", function() {
    if (fuentes) fuentes.style.display = "none"; // cerrar "Acerca de" si estaba abierto
    abrirModalSugerencias();
  });
  if (cerrar) cerrar.addEventListener("click", cerrarModalSugerencias);
  if (overlay) overlay.addEventListener("click", function(e) { if (e.target === overlay) cerrarModalSugerencias(); });
  if (form) form.addEventListener("submit", enviarSugerencia);
}

function abrirModalSugerencias() {
  const estado = document.getElementById("sug-estado");
  if (estado) { estado.textContent = ""; estado.className = "sug-estado"; }
  document.getElementById("modal-sugerencias").style.display = "flex";
}
function cerrarModalSugerencias() {
  document.getElementById("modal-sugerencias").style.display = "none";
}

function enviarSugerencia(e) {
  e.preventDefault();
  const estado = document.getElementById("sug-estado");
  const btn = document.getElementById("btn-enviar-sugerencia");
  const mensaje = document.getElementById("sug-mensaje").value.trim();
  const tipo = document.getElementById("sug-tipo").value;
  const nombre = document.getElementById("sug-nombre").value.trim();
  const email = document.getElementById("sug-email").value.trim();
  const botcheck = document.getElementById("sug-botcheck").checked;

  if (botcheck) return; // honeypot: bot detectado, ignorar en silencio
  if (!mensaje) {
    estado.textContent = "Por favor, escribe tu mensaje.";
    estado.className = "sug-estado sug-estado--error";
    return;
  }
  if (!WEB3FORMS_KEY || WEB3FORMS_KEY === "TU_ACCESS_KEY_AQUI") {
    estado.textContent = "El buzón aún no está configurado. Inténtalo más tarde.";
    estado.className = "sug-estado sug-estado--error";
    return;
  }

  estado.textContent = "Enviando…";
  estado.className = "sug-estado sug-estado--enviando";
  btn.disabled = true;

  const payload = {
    access_key: WEB3FORMS_KEY,
    subject: "DosisPed · " + tipo,
    from_name: nombre || "Usuario de DosisPed",
    // Campos del mensaje
    Tipo: tipo,
    Mensaje: mensaje,
    Nombre: nombre || "(no indicado)",
    Email_de_contacto: email || "(no facilitado)",
    Version_app: APP_VERSION
  };
  if (email) payload.replyto = email; // permite responder directamente al remitente

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data && data.success) {
        estado.textContent = "¡Gracias! Tu mensaje se ha enviado correctamente.";
        estado.className = "sug-estado sug-estado--ok";
        document.getElementById("form-sugerencias").reset();
        setTimeout(cerrarModalSugerencias, 1800);
      } else {
        throw new Error("respuesta no exitosa");
      }
    })
    .catch(function() {
      estado.textContent = "No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.";
      estado.className = "sug-estado sug-estado--error";
    })
    .finally(function() { btn.disabled = false; });
}

// ============================================================
//  VISTA PACIENTE (prescripción multi-fármaco)
// ============================================================
function leerPacienteRx() {
  try { 
    return JSON.parse(localStorage.getItem(KEY_PAC_RX) || "[]"); 
  } catch (e) { 
    return []; 
  }
}
function guardarPacienteRx(rx) {
  localStorage.setItem(KEY_PAC_RX, JSON.stringify(rx));
  actualizarBadgePaciente();
}
function actualizarBadgePaciente() {
  const rx = leerPacienteRx();
  const badge = document.getElementById("btn-paciente-badge");
  const btnAdd = document.getElementById("btn-add-paciente");
  if (badge) {
    if (rx.length === 0) badge.style.display = "none";
    else { badge.style.display = "flex"; badge.textContent = rx.length; }
  }
  // Marcar el botón "+ paciente" si el fármaco actual está en la Rx
  if (btnAdd && farmSeleccionado) {
    const yaGuardado = rx.some(function(r) {
      return r.nombre === farmSeleccionado.nombre &&
        r.modoAdmin === modoAdmin &&
        r.intIndex === intIndex &&
        r.presIndex === presIndex;
    });
    btnAdd.classList.toggle("btn-add-paciente--guardado", yaGuardado);
    btnAdd.title = yaGuardado ? "Ya añadido al paciente — pulsa para actualizar" : "Añadir a la prescripción del paciente";
  }
}

function agregarAPaciente() {
  if (!farmSeleccionado) return;
  const rx = leerPacienteRx();
  // Reemplazar si ya existe con misma combinación pauta/presentación
  const idx = rx.findIndex(function(r) {
    return r.nombre === farmSeleccionado.nombre &&
      r.modoAdmin === modoAdmin &&
      r.intIndex === intIndex &&
      r.presIndex === presIndex;
  });
  const nuevo = {
    nombre: farmSeleccionado.nombre,
    modoAdmin: modoAdmin,
    intIndex: intIndex,
    presIndex: presIndex,
    prepIndex: prepIndex,
    factor: modoAdmin === "intermitente" ? factorInt : 1,
    pesoSnapshot: pesoActual,
    edadSnapshot: edadValor !== null ? (edadValor + " " + edadUnidad) : null,
    ts: Date.now()
  };
  if (idx >= 0) {
    rx[idx] = nuevo;
    mostrarToast(farmSeleccionado.nombre + ": prescripción actualizada", "ok");
  } else {
    rx.push(nuevo);
    mostrarToast(farmSeleccionado.nombre + " añadido al paciente", "ok");
  }
  guardarPacienteRx(rx);
}

function quitarDePaciente(i) {
  const rx = leerPacienteRx();
  rx.splice(i, 1);
  guardarPacienteRx(rx);
  renderModalPaciente();
}

function nuevoPaciente() {
  if (!confirm("¿Iniciar un nuevo paciente? Se borrarán peso, edad, modo neonato y la prescripción actual.")) return;
  // Reset de paciente
  pesoActual = null;
  edadValor = null;
  edadUnidad = "anios";
  modoNeonato = false;
  egSemanas = null;
  epnDias = null;
  ["dosisped-peso","dosisped-edad","dosisped-edad-unidad","dosisped-neonato","dosisped-eg","dosisped-epn",KEY_PAC_RX].forEach(function(k) { return localStorage.removeItem(k); });
  // Limpiar inputs visibles
  ["peso-input","peso-panel-input","edad-input","edad-panel-input","eg-input","epn-input"].forEach(function(id) {
    const el = document.getElementById(id); if (el) el.value = "";
  });
  ["edad-unidad","edad-panel-unidad"].forEach(function(id) {
    const el = document.getElementById(id); if (el) el.value = "anios";
  });
  document.getElementById("btn-neonato").classList.remove("btn-neonato--activo");
  document.getElementById("neonato-panel").style.display = "none";
  actualizarBadgePaciente();
  document.getElementById("modal-paciente").style.display = "none";
  if (farmSeleccionado) renderPanel();
  mostrarToast("Nuevo paciente iniciado", "ok");
}

function abrirModalPaciente() {
  renderModalPaciente();
  document.getElementById("modal-paciente").style.display = "flex";
}

function renderModalPaciente() {
  const sub = document.getElementById("modal-paciente-sub");
  const body = document.getElementById("modal-paciente-body");
  const partes = [];
  if (pesoActual !== null) partes.push(pesoActual + " kg");
  if (edadValor !== null) partes.push(edadValor + " " + (edadUnidad === "anios" ? "años" : edadUnidad));
  if (modoNeonato) {
    if (egSemanas) partes.push("EG " + egSemanas + " sem");
    if (epnDias !== null) partes.push("EPN " + epnDias + " d");
  }
  sub.textContent = partes.length ? partes.join(" · ") : "Sin datos del paciente";

  const rx = leerPacienteRx();
  if (rx.length === 0) {
    body.innerHTML = '<div class="paciente-vacio">' +
      '<strong>Aún no hay prescripciones</strong><br>' +
      'Abre un fármaco y pulsa el botón <b>+</b> en la cabecera del panel para añadirlo a esta lista.</div>';
    return;
  }
  body.innerHTML = rx.map(function(item, i) { return renderTarjetaRx(item, i); }).join("");
}

function renderTarjetaRx(item, idx) {
  const f = farmacos.find(function(x) { return x.nombre === item.nombre; });
  if (!f) {
    return '<div class="paciente-rx-card">' +
      '<div class="paciente-rx-head">' +
      '<span class="paciente-rx-nombre">' + item.nombre + '</span>' +
      '<button class="paciente-rx-quitar" onclick="quitarDePaciente(' + idx + ')">✕</button>' +
      '</div>' +
      '<div class="paciente-rx-aviso">⚠ Fármaco no encontrado en la base actual</div>' +
      '</div>';
  }

  const stale = item.pesoSnapshot !== null && pesoActual !== null && Math.abs(item.pesoSnapshot - pesoActual) > 0.01;
  const calculado = calcularResumenRx(f, item);

  var viaBadge = "";
  if (calculado.via) {
    viaBadge = '<span class="paciente-rx-via-badge farm-via-badge--' + calculado.via.toLowerCase() + '">' + calculado.via.toUpperCase() + '</span>';
  }

  return '<div class="paciente-rx-card' + (stale ? " paciente-rx-card--stale" : "") + '" style="--card-iso-color:' + (f.isoColor || "var(--cyan)") + ';">' +
    '<div class="paciente-rx-head">' +
      '<span class="paciente-rx-icono">' + (f.icono || "💊") + '</span>' +
      '<span class="paciente-rx-nombre">' + f.nombre + '</span>' +
      viaBadge +
      '<button class="paciente-rx-quitar" onclick="quitarDePaciente(' + idx + ')" title="Quitar">✕</button>' +
    '</div>' +
    '<div class="paciente-rx-body">' +
      calculado.lineas.map(function(l) { 
        return '<div class="paciente-rx-linea">' +
          '<span class="paciente-rx-linea-label">' + l.label + '</span>' +
          '<span class="paciente-rx-linea-val' + (l.dosis ? " paciente-rx-linea-val--dosis" : "") + '">' + l.val + '</span>' +
          (l.extra ? '<span class="paciente-rx-linea-extra">' + l.extra + '</span>' : "") +
        '</div>';
      }).join("") +
    '</div>' +
    (stale ? '<div class="paciente-rx-aviso">⚠ Calculado con peso ' + item.pesoSnapshot + ' kg; ahora es ' + pesoActual + ' kg. Re-añade el fármaco para actualizar.</div>' : "") +
    (calculado.alerta ? '<div class="paciente-rx-aviso">' + calculado.alerta + '</div>' : "") +
  '</div>';
}

function calcularResumenRx(f, item) {
  const lineas = [];
  var via = "";
  var alerta = "";
  const pesoUsado = item.pesoSnapshot !== null ? item.pesoSnapshot : pesoActual;

  if (item.modoAdmin === "intermitente" && f.intermitente && f.intermitente[item.intIndex]) {
    const pauta = f.intermitente[item.intIndex];
    via = pauta.via || "";
    // Calcular dosis con el snapshot
    const calc = calcularDosisIntermitenteRx(pauta, pesoUsado);
    const factor = item.factor || 1;
    var dosisFinal = calc.dosis !== null ? calc.dosis * factor : null;
    if (dosisFinal !== null && pauta.dosis_max_mg && dosisFinal > pauta.dosis_max_mg) {
      dosisFinal = pauta.dosis_max_mg;
      alerta = "⚠ Tope aplicado: " + formatNum(pauta.dosis_max_mg,0) + " mg/dosis";
    }
    var dosisDia = calc.dosisDia !== null ? calc.dosisDia * factor : null;
    if (dosisDia !== null && pauta.dosis_max_dia_mg && dosisDia > pauta.dosis_max_dia_mg) {
      dosisDia = pauta.dosis_max_dia_mg;
    }
    if (dosisFinal !== null) {
      lineas.push({ label: "Dosis", val: formatNum(dosisFinal, dosisFinal < 1 ? 3 : dosisFinal < 10 ? 2 : 1) + " mg/toma", dosis: true });
    }
    if (pauta.intervalo_h) {
      lineas.push({ label: "Pauta", val: "cada " + pauta.intervalo_h + " h" + (calc.tomasDia ? " · " + calc.tomasDia + " tomas/día" : "") });
    }
    if (dosisDia !== null) {
      lineas.push({ label: "Total día", val: formatNum(dosisDia, 1) + " mg/día" });
    }
    // Volumen de preparado si hay
    const prep = pauta.preparados && pauta.preparados[item.prepIndex];
    if (prep && prep.conc_mg_ml && dosisFinal !== null) {
      lineas.push({
        label: "Volumen",
        val: formatNum(dosisFinal / prep.conc_mg_ml, 2) + " ml",
        extra: prep.nombre
      });
    }
    if (factor !== 1) {
      lineas.push({ label: "Ajuste", val: Math.round(factor*100) + "% (estándar = 100%)" });
    }
    if (pauta.indicacion) lineas.push({ label: "Indicación", val: pauta.indicacion });
  } else if (item.modoAdmin === "perfusion" && f.presentaciones && f.presentaciones[item.presIndex]) {
    const pres = f.presentaciones[item.presIndex];
    via = "iv";
    lineas.push({ label: "Dilución", val: pres.label });
    lineas.push({ label: "Rango", val: pres.dosisRange });
    lineas.push({ label: "Concentración", val: calcConcentracion(pres).texto });
    if (pesoUsado && pres.dosisMin) {
      const mlh = calcMlH(pres, pres.dosisMin, pesoUsado);
      lineas.push({ label: "Ej. dosis mín.", val: formatNum(mlh, 2) + " ml/h", extra: "(" + pres.dosisMin + " " + pres.unidad + ")", dosis: true });
    }
  } else if (item.modoAdmin === "carga_mantenimiento") {
    var cargaVia = "";
    if (f.carga && f.carga.via) {
      cargaVia = f.carga.via.toLowerCase();
    }
    via = (cargaVia.indexOf("iv") >= 0) ? "iv" : "";
    if (f.carga && pesoUsado) {
      const dosisEspecial = calcularDosisEspecialPeso(f.carga, pesoUsado);
      if (dosisEspecial.dosisTexto) lineas.push({ label: "Carga", val: dosisEspecial.dosisTexto, extra: dosisEspecial.dosisCalc, dosis: true });
      if (f.carga.tiempo_min) lineas.push({ label: "Duración", val: f.carga.tiempo_min + " min" });
      if (f.carga.via) lineas.push({ label: "Vía", val: f.carga.via });
    }
  } else if (item.modoAdmin === "puntual" && f.puntual) {
    var puntualVia = "";
    if (f.puntual.via) {
      puntualVia = f.puntual.via.toLowerCase();
    }
    if (puntualVia.indexOf("im") >= 0) {
      via = "im";
    } else if (puntualVia.indexOf("iv") >= 0) {
      via = "iv";
    } else {
      via = "";
    }
    if (pesoUsado || (f.puntual.dosis_fija_mg !== undefined)) {
      const dosisEspecial = calcularDosisEspecialPeso(f.puntual, pesoUsado);
      if (dosisEspecial.dosisTexto) lineas.push({ label: "Dosis", val: dosisEspecial.dosisTexto, extra: dosisEspecial.dosisCalc, dosis: true });
    }
    if (f.puntual.via) lineas.push({ label: "Vía", val: f.puntual.via });
    if (f.puntual.descripcion) lineas.push({ label: "Indicación", val: f.puntual.descripcion });
  }
  return { lineas: lineas, via: via, alerta: alerta };
}

// Versión helper para Vista paciente: calcula con un peso explícito sin tocar el estado global
function calcularDosisIntermitenteRx(pauta, peso) {
  if (!peso) return { dosis: null, dosisDia: null, tomasDia: null };
  var dosis = null, dosisDia = null;
  const tomasDia = pauta.intervalo_h ? Math.round(24 / pauta.intervalo_h) : null;
  if (pauta.dosis_mg_kg) {
    dosis = pauta.dosis_mg_kg * peso;
    if (tomasDia) dosisDia = dosis * tomasDia;
  } else if (pauta.dosis_mcg_kg) {
    dosis = (pauta.dosis_mcg_kg * peso) / 1000;
    if (tomasDia) dosisDia = dosis * tomasDia;
  } else if (pauta.dosis_mg_kg_dia) {
    dosisDia = pauta.dosis_mg_kg_dia * peso;
    if (tomasDia) dosis = dosisDia / tomasDia;
  } else if (pauta.dosis_fija_mg !== undefined) {
    dosis = pauta.dosis_fija_mg;
    if (tomasDia) dosisDia = dosis * tomasDia;
  }
  return { dosis: dosis, dosisDia: dosisDia, tomasDia: tomasDia };
}

function calcularDosisEspecialPeso(d, peso) {
  var dosisVal = null, dosisTexto = "", dosisCalc = "";
  if (d.dosis_mcg_kg && peso) {
    dosisVal = d.dosis_mcg_kg * peso;
    const enMg = dosisVal / 1000;
    dosisTexto = enMg >= 1 ? (formatNum(enMg, 2) + " mg") : (formatNum(dosisVal, 0) + " mcg");
    dosisCalc = d.dosis_mcg_kg + " mcg/kg × " + peso + " kg";
  } else if (d.dosis_mg_kg && peso) {
    dosisVal = d.dosis_mg_kg * peso;
    if (d.dosis_max_mg && dosisVal > d.dosis_max_mg) dosisVal = d.dosis_max_mg;
    dosisTexto = formatNum(dosisVal, 2) + " mg";
    dosisCalc = d.dosis_mg_kg + " mg/kg × " + peso + " kg" + (d.dosis_max_mg ? " · máx. " + d.dosis_max_mg : "");
  } else if (d.dosis_fija_mg !== undefined) {
    dosisVal = d.dosis_fija_mg;
    dosisTexto = dosisVal < 1 ? (formatNum(dosisVal * 1000, 0) + " mcg") : (formatNum(dosisVal, dosisVal < 10 ? 2 : 0) + " mg");
  }
  return { dosisVal: dosisVal, dosisTexto: dosisTexto, dosisCalc: dosisCalc };
}

function imprimirPrescripcion() {
  const rx = leerPacienteRx();
  if (rx.length === 0) { mostrarToast("No hay prescripciones para imprimir", "error"); return; }

  const partes = [];
  if (pesoActual !== null) partes.push('<span class="print-paciente-label">Peso</span> <strong>' + pesoActual + ' kg</strong>');
  if (edadValor !== null) partes.push('<span class="print-paciente-label">Edad</span> <strong>' + edadValor + ' ' + (edadUnidad === "anios" ? "años" : edadUnidad) + '</strong>');
  if (modoNeonato && egSemanas) partes.push('<span class="print-paciente-label">EG</span> <strong>' + egSemanas + ' sem</strong>');
  if (modoNeonato && epnDias !== null) partes.push('<span class="print-paciente-label">EPN</span> <strong>' + epnDias + ' d</strong>');

  const fecha = new Date();
  const fechaFmt = fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
  const horaFmt = fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  const itemsHtml = rx.map(function(item, i) {
    const f = farmacos.find(function(x) { return x.nombre === item.nombre; });
    if (!f) return "";
    const resumen = calcularResumenRx(f, item);
    return '<div class="print-rx-item" style="border-left-color:' + (f.isoColor || "#333") + ';">' +
      '<div class="print-rx-head">' +
        '<span class="print-rx-numero">' + (i + 1) + '.</span>' +
        '<span class="print-rx-nombre">' + f.nombre + '</span>' +
        (resumen.via ? '<span class="print-rx-via">' + resumen.via.toUpperCase() + '</span>' : "") +
      '</div>' +
      '<div class="print-rx-lineas">' +
        resumen.lineas.map(function(l) {
          return '<div class="print-rx-label">' + l.label + '</div>' +
                 '<div><span class="print-rx-val' + (l.dosis ? " print-rx-val--dosis" : "") + '">' + l.val + '</span>' + (l.extra ? ' <span class="print-rx-extra">' + l.extra + '</span>' : "") + '</div>';
        }).join("") +
      '</div>' +
      (resumen.alerta ? '<div class="print-rx-aviso">' + resumen.alerta + '</div>' : "") +
    '</div>';
  }).join("");

  const html = '<div class="print-header">' +
      '<div>' +
        '<h1 class="print-titulo">Prescripción pediátrica</h1>' +
        '<div class="print-subtitulo">Generada con DosisPed</div>' +
      '</div>' +
      '<div class="print-fecha">' +
        '<div><strong>' + fechaFmt + '</strong></div>' +
        '<div>' + horaFmt + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="print-paciente">' +
      (partes.length ? partes.join(" &nbsp;·&nbsp; ") : "<em>Sin datos del paciente</em>") +
    '</div>' +
    '<div class="print-rx-lista">' +
      itemsHtml +
    '</div>' +
    '<div class="print-disclaimer">' +
      '<strong>Aviso:</strong> Esta prescripción ha sido generada con DosisPed, una herramienta de apoyo clínico basada en Pediamécum (AEP), SEUP, Neofax/SEN y AEMPS. Los cálculos son orientativos y deben ser verificados por un profesional sanitario antes de su aplicación. La situación clínica individual del paciente puede modificar la dosis adecuada.' +
    '</div>' +
    '<div class="print-firma">' +
      '<div class="print-firma-bloque">Firma del facultativo</div>' +
      '<div class="print-firma-bloque">Fecha y nº de colegiado</div>' +
    '</div>' +
    '<div class="print-autor">DosisPed · Diseñada por Carlos J. Galán Doval</div>';

  document.getElementById("print-view").innerHTML = html;
  // Cerrar modal antes de imprimir para evitar conflictos
  document.getElementById("modal-paciente").style.display = "none";
  setTimeout(function() { return window.print(); }, 100);
}

// ── Compartir prescripción por URL ────────────────────
function compartirPrescripcionUrl() {
  const rx = leerPacienteRx();
  if (rx.length === 0) { mostrarToast("No hay prescripciones para compartir", "error"); return; }

  // Formato compacto para minimizar tamaño URL
  const payload = {
    p: pesoActual,
    e: edadValor,
    eu: edadUnidad,
    n: modoNeonato ? 1 : 0,
    eg: egSemanas,
    en: epnDias,
    r: rx.map(function(item) {
      return {
        n: item.nombre,
        m: item.modoAdmin,
        i: item.intIndex,
        pi: item.presIndex,
        px: item.prepIndex,
        f: item.factor
      };
    })
  };
  try {
    const json = JSON.stringify(payload);
    const b64 = btoa(encodeURIComponent(json));
    const baseUrl = window.location.href.split("?")[0].split("#")[0];
    const url = baseUrl + "?rx=" + b64;
    if (!navigator.clipboard) {
      prompt("Copia este enlace:", url);
      return;
    }
    navigator.clipboard.writeText(url)
      .then(function() { return mostrarToast("Enlace copiado (" + rx.length + " fármacos)", "ok"); })
      .catch(function() { return prompt("Copia este enlace:", url); });
  } catch (e) {
    mostrarToast("Error al generar el enlace", "error");
  }
}

function importarPrescripcionDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  const b64 = params.get("rx");
  if (!b64) return;
  try {
    const json = decodeURIComponent(atob(b64));
    const data = JSON.parse(json);

    const tienePresc = data.r && data.r.length > 0;
    var msg = "";
    if (tienePresc) {
      msg = "Vas a cargar una prescripción compartida con " + data.r.length + " fármaco" + (data.r.length > 1 ? "s" : "") + (data.p ? " para un paciente de " + data.p + " kg" : "") + ". ¿Continuar?\n\nSe reemplazarán los datos del paciente actual.";
    } else {
      msg = "El enlace está vacío.";
    }
    if (!tienePresc || !confirm(msg)) {
      history.replaceState({}, "", window.location.pathname);
      return;
    }

    // Restaurar paciente
    if (typeof data.p === "number") { pesoActual = data.p; localStorage.setItem(KEY_PESO, String(data.p)); }
    if (typeof data.e === "number") { edadValor = data.e; localStorage.setItem(KEY_EDAD, String(data.e)); }
    if (data.eu) { edadUnidad = data.eu; localStorage.setItem(KEY_EDAD_UN, data.eu); }
    if (data.n) {
      modoNeonato = true;
      localStorage.setItem(KEY_NEONATO, "true");
      document.getElementById("btn-neonato").classList.add("btn-neonato--activo");
      document.getElementById("neonato-panel").style.display = "block";
      if (data.eg) { egSemanas = data.eg; localStorage.setItem(KEY_EG, String(data.eg)); document.getElementById("eg-input").value = String(data.eg).replace(".",","); }
      if (data.en !== null && data.en !== undefined) { epnDias = data.en; localStorage.setItem(KEY_EPN, String(data.en)); document.getElementById("epn-input").value = String(data.en).replace(".",","); }
    }
    // Pintar inputs
    if (pesoActual !== null) ["peso-input","peso-panel-input"].forEach(function(id) { const e = document.getElementById(id); if (e) e.value = String(pesoActual).replace(".",","); });
    if (edadValor !== null) ["edad-input","edad-panel-input"].forEach(function(id) { const e = document.getElementById(id); if (e) e.value = String(edadValor).replace(".",","); });
    ["edad-unidad","edad-panel-unidad"].forEach(function(id) { const e = document.getElementById(id); if (e) e.value = edadUnidad; });

    // Restaurar Rx
    const rxRestaurada = data.r.map(function(item) {
      return {
        nombre: item.n,
        modoAdmin: item.m,
        intIndex: item.i || 0,
        presIndex: item.pi || 0,
        prepIndex: item.px || 0,
        factor: item.f || 1,
        pesoSnapshot: pesoActual,
        edadSnapshot: edadValor !== null ? (edadValor + " " + edadUnidad) : null,
        ts: Date.now()
      };
    });
    localStorage.setItem(KEY_PAC_RX, JSON.stringify(rxRestaurada));
    actualizarBadgePaciente();
    mostrarToast("Prescripción cargada: " + rxRestaurada.length + " fármacos", "ok");
    // Limpiar la URL para que un reload no recargue de nuevo
    history.replaceState({}, "", window.location.pathname);
    // Abrir directamente la vista paciente
    setTimeout(function() { return abrirModalPaciente(); }, 300);
  } catch (e) {
    mostrarToast("El enlace está corrupto o es inválido", "error");
    history.replaceState({}, "", window.location.pathname);
  }
}

function copiarPrescripcion() {
  const rx = leerPacienteRx();
  if (rx.length === 0) { mostrarToast("No hay prescripciones para copiar", "error"); return; }

  var texto = "PRESCRIPCIÓN PEDIÁTRICA — DosisPed\n";
  texto += "═══════════════════════════════\n";
  const partes = [];
  if (pesoActual !== null) partes.push("Peso: " + pesoActual + " kg");
  if (edadValor !== null) partes.push("Edad: " + edadValor + " " + (edadUnidad === "anios" ? "años" : edadUnidad));
  if (modoNeonato && egSemanas) partes.push("EG: " + egSemanas + " sem");
  if (modoNeonato && epnDias !== null) partes.push("EPN: " + epnDias + " d");
  texto += partes.join(" · ") + "\n\n";

  rx.forEach(function(item, i) {
    const f = farmacos.find(function(x) { return x.nombre === item.nombre; });
    if (!f) return;
    const resumen = calcularResumenRx(f, item);
    texto += (i + 1) + ". " + f.nombre + "\n";
    if (resumen.via) texto += "   Vía: " + resumen.via.toUpperCase() + "\n";
    resumen.lineas.forEach(function(l) {
      texto += "   " + l.label + ": " + l.val + (l.extra ? " (" + l.extra + ")" : "") + "\n";
    });
    if (resumen.alerta) texto += "   " + resumen.alerta + "\n";
    texto += "\n";
  });
  texto += "─────────\nHerramienta de apoyo clínico. Verificar antes de prescribir.";

  if (!navigator.clipboard) { mostrarToast("Copia no disponible en este navegador", "error"); return; }
  navigator.clipboard.writeText(texto)
    .then(function() { return mostrarToast("Prescripción copiada (" + rx.length + " fármacos)", "ok"); })
    .catch(function() { return mostrarToast("No se pudo copiar", "error"); });
}

// ============================================================
//  HISTORIAL DE SESIÓN (sessionStorage)
// ============================================================
function leerHistorial() {
  try { 
    return JSON.parse(sessionStorage.getItem(KEY_HIST) || "[]"); 
  } catch (e) { 
    return []; 
  }
}
function registrarHistorial(f) {
  const lista = leerHistorial().filter(function(x) { return x.nombre !== f.nombre; });
  lista.unshift({
    nombre: f.nombre,
    categoria: f.categoria,
    icono: f.icono || "💊",
    ts: Date.now()
  });
  if (lista.length > 15) lista.length = 15;
  sessionStorage.setItem(KEY_HIST, JSON.stringify(lista));
  renderHistorial();
}
function toggleHistorial() {
  const drop = document.getElementById("historial-dropdown");
  const open = drop.style.display === "block";
  if (open) { drop.style.display = "none"; return; }
  renderHistorial();
  drop.style.display = "block";
}
function renderHistorial() {
  const cont = document.getElementById("historial-lista");
  const lista = leerHistorial();
  if (!lista.length) {
    cont.innerHTML = '<div class="historial-vacio">Sin cálculos en esta sesión todavía.</div>';
    return;
  }
  cont.innerHTML = lista.map(function(item) {
    const min = Math.round((Date.now() - item.ts) / 60000);
    var tiempo = "";
    if (min < 1) {
      tiempo = "ahora";
    } else if (min < 60) {
      tiempo = "hace " + min + " min";
    } else {
      tiempo = "hace " + Math.floor(min/60) + " h";
    }
    return '<div class="historial-item" onclick="abrirDesdeHistorial(\'' + item.nombre.replace(/'/g, "\\'") + '\')">' +
      '<span class="historial-item-icono">' + item.icono + '</span>' +
      '<div class="historial-item-info">' +
        '<span class="historial-item-nombre">' + item.nombre + '</span>' +
        '<span class="historial-item-cat">' + item.categoria + '</span>' +
      '</div>' +
      '<span class="historial-item-time">' + tiempo + '</span>' +
    '</div>';
  }).join("");
}
function abrirDesdeHistorial(nombre) {
  document.getElementById("historial-dropdown").style.display = "none";
  const f = farmacos.find(function(x) { return x.nombre === nombre; });
  if (f) seleccionarFarmaco(f);
}

// ============================================================
//  FAVORITOS
// ============================================================
function toggleFavorito(nombre) {
  if (favoritos.has(nombre)) favoritos["delete"](nombre);
  else favoritos.add(nombre);
  localStorage.setItem(KEY_FAV, JSON.stringify([...favoritos]));
  actualizarBtnFavorito();
  renderizarLista(document.getElementById("busqueda").value);
}
function actualizarBtnFavorito() {
  const btn = document.getElementById("btn-favorito");
  if (!btn || !farmSeleccionado) return;
  const esFav = favoritos.has(farmSeleccionado.nombre);
  btn.classList.toggle("btn-favorito--activo", esFav);
  btn.title = esFav ? "Quitar de favoritos" : "Añadir a favoritos";
}

// ============================================================
//  FILTROS Y LISTA
// ============================================================
function construirFiltros() {
  const cont = document.getElementById("filtros");
  cont.innerHTML = "";

  const btnFav = document.createElement("button");
  btnFav.className = "chip chip--fav" + (categoriaFiltro === "Favoritos" ? " chip--activo" : "");
  btnFav.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:-1px;margin-right:3px"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>Favoritos';
  btnFav.addEventListener("click", function() {
    categoriaFiltro = "Favoritos";
    document.querySelectorAll("#filtros .chip").forEach(function(b) { return b.classList.remove("chip--activo"); });
    btnFav.classList.add("chip--activo");
    renderizarLista(document.getElementById("busqueda").value);
  });
  cont.appendChild(btnFav);

  const todas = ["Todos"].concat(categorias);
  todas.forEach(function(cat) {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat === categoriaFiltro ? " chip--activo" : "");
    btn.textContent = cat;
    btn.addEventListener("click", function() {
      categoriaFiltro = cat;
      document.querySelectorAll("#filtros .chip").forEach(function(b) { return b.classList.remove("chip--activo"); });
      btn.classList.add("chip--activo");
      renderizarLista(document.getElementById("busqueda").value);
    });
    cont.appendChild(btn);
  });
}

// Normaliza texto: minúsculas y sin acentos/diacríticos
function normalizar(s) {
  return (s == null ? "" : String(s)).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Escapa HTML para insertar texto de datos de forma segura
function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Extrae un fragmento de texto alrededor del término encontrado
function extraerFragmento(texto, qNorm) {
  var norm = normalizar(texto);
  var idx = norm.indexOf(qNorm);
  if (idx < 0) return texto.length > 70 ? texto.slice(0, 70) + "…" : texto;
  var ini = Math.max(0, idx - 22);
  var fin = Math.min(texto.length, idx + qNorm.length + 38);
  return (ini > 0 ? "…" : "") + texto.slice(ini, fin) + (fin < texto.length ? "…" : "");
}

// Resalta el término dentro de un fragmento (sobre texto ya escapado)
function resaltar(fragmento, qNorm) {
  var safe = escHtml(fragmento);
  var norm = normalizar(safe);
  var idx = norm.indexOf(qNorm);
  if (idx < 0 || !qNorm) return safe;
  return safe.slice(0, idx) + "<mark>" + safe.slice(idx, idx + qNorm.length) + "</mark>" + safe.slice(idx + qNorm.length);
}

// Escapa caracteres especiales de regex
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Coincidencia al INICIO de una palabra (evita falsos positivos como 'asma' en 'eritrasma').
// Se usa en campos de texto clínico (indicaciones, notas, categoría).
function matchInicioPalabra(textoNorm, qNorm) {
  if (!qNorm) return true;
  return new RegExp("(^|[^a-z0-9])" + escapeRegex(qNorm)).test(textoNorm);
}

// Busca el término en los campos "positivos" del fármaco (NO en contraindicaciones/precauciones).
// Devuelve null si no hay coincidencia, o { tipo, texto } indicando dónde coincide.
// Nombre/sinónimos/vías: substring (permite teclear parcial). Campos clínicos: inicio de palabra.
function buscarEnFarmaco(f, qNorm) {
  if (!qNorm) return { tipo: "nombre" };
  // 1. Nombre (substring, sin etiqueta)
  if (normalizar(f.nombre).indexOf(qNorm) >= 0) return { tipo: "nombre" };
  // 2. Sinónimos / marcas comerciales (substring)
  if (f.sinonimos) {
    for (var i = 0; i < f.sinonimos.length; i++) {
      if (normalizar(f.sinonimos[i]).indexOf(qNorm) >= 0) return { tipo: "sinonimo", texto: f.sinonimos[i] };
    }
  }
  // 3. Indicaciones clínicas (info.indicaciones) — inicio de palabra
  if (f.info && f.info.indicaciones) {
    for (var j = 0; j < f.info.indicaciones.length; j++) {
      if (matchInicioPalabra(normalizar(f.info.indicaciones[j]), qNorm)) return { tipo: "indicación", texto: f.info.indicaciones[j] };
    }
  }
  // 4. Indicación de pautas intermitentes
  if (f.intermitente) {
    for (var k = 0; k < f.intermitente.length; k++) {
      var p = f.intermitente[k];
      if (p.indicacion && matchInicioPalabra(normalizar(p.indicacion), qNorm)) return { tipo: "indicación", texto: p.indicacion };
    }
  }
  // 5. Carga / Puntual: descripción
  if (f.carga && f.carga.descripcion && matchInicioPalabra(normalizar(f.carga.descripcion), qNorm)) return { tipo: "indicación", texto: f.carga.descripcion };
  if (f.puntual && f.puntual.descripcion && matchInicioPalabra(normalizar(f.puntual.descripcion), qNorm)) return { tipo: "indicación", texto: f.puntual.descripcion };
  // 6. Presentaciones (perfusión): label
  if (f.presentaciones) {
    for (var m = 0; m < f.presentaciones.length; m++) {
      if (f.presentaciones[m].label && matchInicioPalabra(normalizar(f.presentaciones[m].label), qNorm)) return { tipo: "dilución", texto: f.presentaciones[m].label };
    }
  }
  // 7. Categoría
  if (matchInicioPalabra(normalizar(f.categoria), qNorm)) return { tipo: "categoría", texto: f.categoria };
  // 8. Vías (substring)
  if (f.vias) {
    for (var v = 0; v < f.vias.length; v++) {
      if (normalizar(f.vias[v]).indexOf(qNorm) >= 0) return { tipo: "vía", texto: f.vias[v] };
    }
  }
  // 9. Notas clínicas (intermitente / carga / puntual) — inicio de palabra, último recurso
  var notas = [];
  if (f.intermitente) f.intermitente.forEach(function(p) { if (p.nota) notas.push(p.nota); });
  if (f.carga && f.carga.nota) notas.push(f.carga.nota);
  if (f.puntual && f.puntual.nota) notas.push(f.puntual.nota);
  for (var n = 0; n < notas.length; n++) {
    if (matchInicioPalabra(normalizar(notas[n]), qNorm)) return { tipo: "nota", texto: extraerFragmento(notas[n], qNorm) };
  }
  return null;
}

function renderizarLista(query) {
  if (query === undefined) query = "";
  const cont = document.getElementById("lista-farmacos");
  cont.innerHTML = "";
  const qNorm = normalizar(query.trim());

  // Relevancia por tipo de coincidencia (menor = más relevante)
  const PESO_MATCH = { "nombre": 0, "sinonimo": 1, "indicación": 2, "dilución": 3, "categoría": 4, "vía": 5, "nota": 6 };

  // Construye lista de coincidencias con su motivo
  const resultados = [];
  farmacos.forEach(function(f) {
    if (categoriaFiltro === "Favoritos" && !favoritos.has(f.nombre)) return;
    if (categoriaFiltro !== "Favoritos" && categoriaFiltro !== "Todos" && f.categoria !== categoriaFiltro) return;
    const match = buscarEnFarmaco(f, qNorm);
    if (match) resultados.push({ f: f, match: match });
  });

  // Ordena por relevancia del match (solo si hay búsqueda); dentro del mismo nivel, alfabético
  if (qNorm) {
    resultados.sort(function(a, b) {
      const pa = PESO_MATCH[a.match.tipo] != null ? PESO_MATCH[a.match.tipo] : 9;
      const pb = PESO_MATCH[b.match.tipo] != null ? PESO_MATCH[b.match.tipo] : 9;
      if (pa !== pb) return pa - pb;
      return a.f.nombre.localeCompare(b.f.nombre);
    });
  }

  // Contador de resultados (solo si hay búsqueda activa)
  const contador = document.getElementById("busqueda-contador");
  if (contador) {
    if (qNorm) {
      contador.textContent = resultados.length + (resultados.length === 1 ? " fármaco" : " fármacos");
      contador.classList.add("visible");
    } else {
      contador.classList.remove("visible");
    }
  }

  if (resultados.length === 0) {
    if (categoriaFiltro === "Favoritos") {
      cont.innerHTML = '<p class="sin-resultados">No hay favoritos guardados.<br><small>Abre un fármaco y pulsa la estrella ☆</small></p>';
    } else {
      cont.innerHTML = '<p class="sin-resultados">No se encontraron fármacos<br><small>Prueba con el principio activo, marca o una indicación</small></p>';
    }
    return;
  }

  resultados.forEach(function(r) {
    const f = r.f;
    const match = r.match;
    const card     = document.createElement("div");
    const esActiva = farmSeleccionado && farmSeleccionado.nombre === f.nombre;
    const esFav    = favoritos.has(f.nombre);
    card.className = "farm-card" + (esActiva ? " farm-card--activa" : "");
    card.style.setProperty("--card-iso-color", f.isoColor || "var(--border)");

    const vias = (f.vias || []).slice(0, 4).map(function(v) {
      return '<span class="farm-via-badge farm-via-badge--' + v.toLowerCase() + '">' + v.toUpperCase() + '</span>';
    }).join("");

    // Etiqueta de coincidencia: solo si la búsqueda no coincidió por el nombre
    var matchHtml = "";
    if (qNorm && match.tipo !== "nombre" && match.texto) {
      matchHtml = '<span class="farm-match"><span class="farm-match-tipo">' + match.tipo + ':</span> ' +
        resaltar(match.texto, qNorm) + '</span>';
    }

    card.innerHTML = '<div class="farm-iso-strip"></div>' +
      '<span class="farm-icono">' + (f.icono || "💊") + '</span>' +
      '<div class="farm-info">' +
        '<span class="farm-nombre">' + f.nombre + '</span>' +
        '<span class="farm-cat">' + f.categoria + '</span>' +
        (vias ? '<div class="farm-vias">' + vias + '</div>' : "") +
        matchHtml +
      '</div>' +
      '<div class="farm-card-right">' +
        (esFav ? '<span class="farm-estrella">★</span>' : "") +
      '</div>';
    card.addEventListener("click", function() { return seleccionarFarmaco(f); });
    cont.appendChild(card);
  });
}

function labelModo(modo) {
  const labels = {
    intermitente:        "Dosis intermitente",
    perfusion:           "Perfusión continua",
    puntual:             "Dosis puntual",
    carga_mantenimiento: "Carga + Mantenim."
  };
  return labels[modo] || modo;
}

// ── Búsqueda ───────────────────────────────────────────────
function bindBusqueda() {
  const input = document.getElementById("busqueda");
  const btnLimpiar = document.getElementById("busqueda-limpiar");

  function actualizarBotonLimpiar() {
    if (!btnLimpiar) return;
    if (input.value.length > 0) btnLimpiar.classList.add("visible");
    else btnLimpiar.classList.remove("visible");
  }

  function limpiarBusqueda() {
    input.value = "";
    actualizarBotonLimpiar();
    renderizarLista("");
    input.focus();
  }

  input.addEventListener("input", function(e) {
    actualizarBotonLimpiar();
    renderizarLista(e.target.value);
  });

  // Escape limpia la búsqueda
  input.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && input.value) {
      e.preventDefault();
      limpiarBusqueda();
    }
  });

  if (btnLimpiar) btnLimpiar.addEventListener("click", limpiarBusqueda);
}

// ============================================================
//  SELECCIÓN DE FÁRMACO
// ============================================================
function seleccionarFarmaco(f) {
  farmSeleccionado = f;
  presIndex   = 0;
  intIndex    = 0;
  prepIndex   = 0;
  factorInt   = 1.0;
  modoCalculo = "dosis";
  modoAdmin   = (f.modos && f.modos.length > 0) ? f.modos[0] : "intermitente";
  clinicaTab  = "indicaciones";
  clinicaAbierta = false;
  localStorage.setItem(KEY_ULTIMO, f.nombre);
  registrarHistorial(f);
  abrirPanel();
  renderPanel();
  renderizarLista(document.getElementById("busqueda").value);
}

function abrirPanel() {
  if (window.innerWidth <= 640) {
    document.getElementById("panel-overlay").classList.add("visible");
  }
  document.getElementById("panel-detalle").classList.add("abierto");
  document.querySelector(".app-content").classList.add("con-panel");
}

function cerrarPanel() {
  document.getElementById("panel-overlay").classList.remove("visible");
  document.getElementById("panel-detalle").classList.remove("abierto");
  document.querySelector(".app-content").classList.remove("con-panel");
  farmSeleccionado = null;
  localStorage.removeItem(KEY_ULTIMO);
  renderizarLista(document.getElementById("busqueda").value);
}

function limpiarCalc() {
  document.getElementById("valor-input").value = "";
  const box = document.getElementById("resultado-box");
  box.innerHTML = "";
  box.className = "resultado-box resultado-box--vacio";
}

// ============================================================
//  RENDER PANEL
// ============================================================
function renderPanel() {
  if (!farmSeleccionado) return;
  const f = farmSeleccionado;

  document.getElementById("panel-icono").textContent = f.icono || "💊";
  document.getElementById("panel-titulo").textContent = f.nombre;
  const catEl = document.getElementById("panel-categoria");
  catEl.textContent = f.categoria;
  catEl.style.color = f.isoColor || "var(--cyan)";
  actualizarBtnFavorito();
  actualizarBadgePaciente();

  renderAdminModos(f);
  renderTabsSegunModo(f);

  // Ocultar todo, luego mostrar según modo
  ["dosis-int-box", "carga-box", "puntual-box", "calculadora-section", "info-collapse", "aviso-peso"].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
  const resBox = document.getElementById("resultado-box");
  resBox.className = "resultado-box resultado-box--vacio";
  resBox.innerHTML = "";

  if (modoAdmin === "intermitente") renderModoIntermitente(f);
  else if (modoAdmin === "perfusion") renderModoPerfusion(f);
  else if (modoAdmin === "carga_mantenimiento") renderModoCargaMant(f);
  else if (modoAdmin === "puntual") renderModoPuntual(f);

  renderInfoClinica(f);
  document.getElementById("info-collapse").classList.remove("info-collapse--abierto");
  clinicaAbierta = false;
  document.getElementById("clinica-body").style.display = "none";
  document.getElementById("clinica-chevron").style.transform = "";
}

function renderAdminModos(f) {
  const cont = document.getElementById("admin-modo-cont");
  if (!f.modos || f.modos.length <= 1) { cont.style.display = "none"; return; }
  cont.style.display = "flex";
  cont.innerHTML = "";
  f.modos.forEach(function(modo) {
    const btn = document.createElement("button");
    btn.className = "btn-admin-modo" + (modo === modoAdmin ? " admin-modo--activo" : "");
    btn.textContent = labelModo(modo);
    btn.addEventListener("click", function() {
      modoAdmin = modo;
      intIndex = 0; presIndex = 0; prepIndex = 0;
      limpiarCalc();
      renderPanel();
    });
    cont.appendChild(btn);
  });
}

function renderTabsSegunModo(f) {
  const cont = document.getElementById("tabs-presentaciones");
  cont.innerHTML = "";

  var items = [];
  var activeIdx = 0;
  var onClick = null;

  if (modoAdmin === "intermitente" && f.intermitente && f.intermitente.length > 1) {
    items = f.intermitente.map(function(p) { return p.indicacion || p.via || "Pauta"; });
    activeIdx = intIndex;
    onClick = function(i) { intIndex = i; prepIndex = 0; renderPanel(); };
  } else if (modoAdmin === "perfusion" && f.presentaciones && f.presentaciones.length > 1) {
    items = f.presentaciones.map(function(p) { return p.label; });
    activeIdx = presIndex;
    onClick = function(i) { presIndex = i; renderPanel(); };
  }
  if (modoAdmin === "intermitente") {
    // Reset factor cuando cambia la pauta activa
    const tabsCambiados = (window._lastIntKey !== (f.nombre + "-" + intIndex));
    if (tabsCambiados) { factorInt = 1.0; window._lastIntKey = f.nombre + "-" + intIndex; }
  }

  if (items.length === 0) { cont.style.display = "none"; return; }
  cont.style.display = "flex";
  items.forEach(function(label, i) {
    const btn = document.createElement("button");
    btn.className = "tab-pres" + (i === activeIdx ? " tab-pres--activa" : "");
    btn.textContent = label;
    btn.addEventListener("click", function() { return onClick(i); });
    cont.appendChild(btn);
  });
}

// ============================================================
//  MODO: INTERMITENTE (oral, IV intermitente, IM, rectal, ...)
// ============================================================
function renderModoIntermitente(f) {
  if (!f.intermitente || f.intermitente.length === 0) {
    document.getElementById("dosis-int-box").style.display = "block";
    document.getElementById("dosis-int-box").innerHTML =
      '<div class="dosis-int-nota">Sin datos de dosis intermitente para este fármaco.</div>';
    return;
  }
  const pauta = f.intermitente[intIndex];
  const necesitaPeso = !!(pauta.dosis_mg_kg || pauta.dosis_mcg_kg || pauta.dosis_mg_kg_dia);
  if (necesitaPeso && !pesoActual) {
    document.getElementById("aviso-peso").style.display = "flex";
    document.getElementById("aviso-peso-texto").textContent = "Introduce el peso del paciente para calcular la dosis";
  }
  renderIntermitenteBox(f, pauta);
}

function renderIntermitenteBox(f, pauta) {
  const box = document.getElementById("dosis-int-box");
  box.style.display = "block";

  const calc = calcularDosisIntermitente(pauta);

  // Estado de alerta sobre dosis máxima
  var estado = "ok";
  var alertaHtml = "";
  if (calc.dosis !== null) {
    if (pauta.dosis_max_mg && calc.dosis > pauta.dosis_max_mg) {
      estado = "max";
      alertaHtml = '<div class="dosis-int-alerta dosis-int-alerta--max"><span>⚠️</span><span><b>Dosis máxima por toma:</b> ' + formatNum(pauta.dosis_max_mg, 0) + ' mg. Se aplicará el tope.</span></div>';
    }
  }
  if (calc.dosisDia !== null && pauta.dosis_max_dia_mg && calc.dosisDia > pauta.dosis_max_dia_mg) {
    alertaHtml += '<div class="dosis-int-alerta dosis-int-alerta--max"><span>⚠️</span><span><b>Dosis diaria máxima:</b> ' + formatNum(pauta.dosis_max_dia_mg, 0) + ' mg/día. Tope aplicable.</span></div>';
  }

  var viaBadge = "";
  if (pauta.via) {
    viaBadge = '<span class="dosis-int-via-badge farm-via-badge--' + pauta.via.toLowerCase() + '">' + pauta.via.toUpperCase() + '</span>';
  }

  // Aplicar factor de ajuste fino
  var dosisFinal = calc.dosis;
  if (dosisFinal !== null) dosisFinal = dosisFinal * factorInt;
  var dosisDiaConFactor = calc.dosisDiaFinal;
  if (dosisDiaConFactor !== null) dosisDiaConFactor = dosisDiaConFactor * factorInt;

  // Aplicar tope absoluto tras factor
  var topeAplicado = false;
  if (dosisFinal !== null && pauta.dosis_max_mg && dosisFinal > pauta.dosis_max_mg) {
    dosisFinal = pauta.dosis_max_mg;
    topeAplicado = true;
  }

  // Selector de preparado (si hay)
  const preparados = pauta.preparados || [];
  var preparadosHtml = "";
  if (preparados.length > 0 && dosisFinal !== null) {
    preparadosHtml = '<div class="dosis-int-preparados">' +
      '<div class="dosis-int-preparados-label">Preparados comerciales · volumen por toma</div>' +
      '<div class="dosis-int-prep-list">' +
        preparados.map(function(p, i) {
          const vol = dosisFinal / p.conc_mg_ml;
          return '<div class="dosis-int-prep-item' + (i === prepIndex ? " dosis-int-prep-item--activo" : "") + '" onclick="seleccionarPreparado(' + i + ')">' +
            '<div style="flex:1;min-width:0;">' +
              '<div class="dosis-int-prep-nombre">' + p.nombre + '</div>' +
              '<div class="dosis-int-prep-conc">' + formatNum(p.conc_mg_ml, 2) + ' mg/ml</div>' +
            '</div>' +
            '<div class="dosis-int-prep-vol">' + formatNum(vol, 2) + ' ml</div>' +
          '</div>';
        }).join("") +
      '</div>' +
    '</div>';
  }

  // Detalles
  const detalles = [];
  if (pauta.intervalo_h) detalles.push({ l: "Intervalo", v: "cada " + pauta.intervalo_h + " h" });
  if (pauta.dosis_mg_kg) detalles.push({ l: "Dosis", v: formatNum(pauta.dosis_mg_kg, 3) + " mg/kg/dosis" });
  else if (pauta.dosis_mcg_kg) detalles.push({ l: "Dosis", v: formatNum(pauta.dosis_mcg_kg, 1) + " mcg/kg/dosis" });
  else if (pauta.dosis_mg_kg_dia) detalles.push({ l: "Dosis", v: formatNum(pauta.dosis_mg_kg_dia, 2) + " mg/kg/día" });
  if (pauta.dosis_max_mg)     detalles.push({ l: "Máx/toma",  v: formatNum(pauta.dosis_max_mg, 0) + " mg" });
  if (pauta.dosis_max_dia_mg) detalles.push({ l: "Máx/día",   v: formatNum(pauta.dosis_max_dia_mg, 0) + " mg" });
  if (pauta.duracion)         detalles.push({ l: "Duración",  v: pauta.duracion });

  // Slider de ajuste fino (solo si hay dosis calculada por peso)
  const muestraSlider = calc.dosis !== null && (pauta.dosis_mg_kg || pauta.dosis_mcg_kg || pauta.dosis_mg_kg_dia);
  var sliderHtml = "";
  var sliderColor = "var(--cyan)";
  
  if (muestraSlider) {
    const pct = Math.round(factorInt * 100);
    if (factorInt < 0.85) sliderColor = "var(--cyan)";
    else if (factorInt > 1.15) sliderColor = "var(--amber)";
    else sliderColor = "var(--green)";
    
    sliderHtml = '<div class="ajuste-fino-wrap">' +
      '<div class="ajuste-fino-header">' +
        '<span class="ajuste-fino-label">Ajuste fino</span>' +
        '<span class="ajuste-fino-valor" style="color:' + sliderColor + '">' + pct + '%' + (factorInt === 1 ? " (estándar)" : "") + '</span>' +
      '</div>' +
      '<input type="range" class="ajuste-fino-slider"' +
        'min="0.5" max="1.5" step="0.05"' +
        'value="' + factorInt + '"' +
        'oninput="onAjusteFinoInput(this)"' +
        'onchange="onAjusteFino(this)">' +
      '<div class="ajuste-fino-marcas">' +
        '<span>0,5×</span><span>1×</span><span>1,5×</span>' +
      '</div>' +
    '</div>';
  }

  var resHtml = "";
  if (calc.dosis !== null) {
    resHtml = '<div class="dosis-int-resultado">' +
      '<span class="dosis-int-val' + (estado === "max" ? " dosis-int-val--alerta" : "") + '">' + formatNum(dosisFinal, dosisFinal < 1 ? 3 : dosisFinal < 10 ? 2 : 1) + '</span>' +
      '<span class="dosis-int-unidad">mg / toma' + (factorInt !== 1 ? ' <span style="color:' + sliderColor + ';font-weight:600;">· ' + Math.round(factorInt*100) + '%</span>' : "") + '</span>' +
      (calc.calcTexto ? '<span class="dosis-int-calc">' + calc.calcTexto + (factorInt !== 1 ? " × " + factorInt.toFixed(2).replace(".",",") : "") + '</span>' : "") +
      (calc.dosisDia !== null ? '<div class="dosis-int-vol">' +
        '<span class="dosis-int-vol-label">Total día</span>' +
        '<span class="dosis-int-vol-val">' + formatNum(dosisDiaConFactor, 1) + '</span>' +
        '<span class="dosis-int-vol-unidad">mg/día · ' + (calc.tomasDia ? calc.tomasDia + " tomas" : "") + '</span>' +
      '</div>' : "") +
      sliderHtml +
    '</div>';
  } else {
    resHtml = '<div class="dosis-int-resultado"><span class="dosis-int-val" style="font-size:18px;color:var(--text-3);">Introduce el peso</span></div>';
  }

  box.innerHTML = '<div class="dosis-int-header">' +
      '<span class="dosis-int-titulo">Dosis pediátrica</span>' +
      viaBadge +
      '<span class="dosis-int-indicacion">' + (pauta.indicacion || "") + '</span>' +
    '</div>' +
    resHtml +
    preparadosHtml +
    (detalles.length ? '<div class="dosis-int-detalles">' + detalles.map(function(d) { return '<div class="dosis-int-det"><span class="dosis-int-det-label">' + d.l + '</span><span class="dosis-int-det-val">' + d.v + '</span></div>'; }).join("") + '</div>' : "") +
    alertaHtml +
    (pauta.nota ? '<div class="dosis-int-nota">' + pauta.nota + '</div>' : "");
}

function calcularDosisIntermitente(pauta) {
  var dosis = null;       // mg por toma
  var dosisDia = null;    // mg por día
  var calcTexto = "";
  var tomasDia = pauta.intervalo_h ? Math.round(24 / pauta.intervalo_h) : null;

  if (pauta.dosis_mg_kg && pesoActual) {
    dosis = pauta.dosis_mg_kg * pesoActual;
    calcTexto = formatNum(pauta.dosis_mg_kg, 3) + " mg/kg × " + pesoActual + " kg";
    if (tomasDia) dosisDia = dosis * tomasDia;
  } else if (pauta.dosis_mcg_kg && pesoActual) {
    dosis = (pauta.dosis_mcg_kg * pesoActual) / 1000; // a mg
    calcTexto = formatNum(pauta.dosis_mcg_kg, 1) + " mcg/kg × " + pesoActual + " kg = " + formatNum(pauta.dosis_mcg_kg * pesoActual, 0) + " mcg";
    if (tomasDia) dosisDia = dosis * tomasDia;
  } else if (pauta.dosis_mg_kg_dia && pesoActual) {
    dosisDia = pauta.dosis_mg_kg_dia * pesoActual;
    if (tomasDia) {
      dosis = dosisDia / tomasDia;
      calcTexto = formatNum(pauta.dosis_mg_kg_dia, 2) + " mg/kg/día × " + pesoActual + " kg ÷ " + tomasDia + " tomas";
    } else {
      calcTexto = formatNum(pauta.dosis_mg_kg_dia, 2) + " mg/kg/día × " + pesoActual + " kg";
    }
  } else if (pauta.dosis_fija_mg !== undefined) {
    dosis = pauta.dosis_fija_mg;
    calcTexto = "Dosis fija";
    if (tomasDia) dosisDia = dosis * tomasDia;
  }

  var dosisDiaFinal = dosisDia;
  if (dosisDia !== null && pauta.dosis_max_dia_mg && dosisDia > pauta.dosis_max_dia_mg) {
    dosisDiaFinal = pauta.dosis_max_dia_mg;
  }

  return { dosis: dosis, dosisDia: dosisDia, dosisDiaFinal: dosisDiaFinal, calcTexto: calcTexto, tomasDia: tomasDia };
}

function seleccionarPreparado(i) {
  prepIndex = i;
  renderPanel();
}

function onAjusteFinoInput(slider) {
  // Live update parcial sin re-renderizar el slider (perdería el arrastre)
  factorInt = parseFloat(slider.value);
  if (!farmSeleccionado || modoAdmin !== "intermitente") return;
  const pauta = farmSeleccionado.intermitente[intIndex];
  if (!pauta) return;
  const calc = calcularDosisIntermitente(pauta);
  if (calc.dosis === null) return;
  var dosisFinal = calc.dosis * factorInt;
  var topeOk = true;
  if (pauta.dosis_max_mg && dosisFinal > pauta.dosis_max_mg) { dosisFinal = pauta.dosis_max_mg; topeOk = false; }
  const dosisDia = calc.dosisDiaFinal !== null ? calc.dosisDiaFinal * factorInt : null;

  // Actualizar header del slider
  const pct = Math.round(factorInt * 100);
  var color = "var(--cyan)";
  if (factorInt < 0.85) color = "var(--cyan)";
  else if (factorInt > 1.15) color = "var(--amber)";
  else color = "var(--green)";
  const valorEl = document.querySelector(".ajuste-fino-valor");
  if (valorEl) {
    valorEl.style.color = color;
    valorEl.textContent = pct + "%" + (factorInt === 1 ? " (estándar)" : "");
  }

  // Actualizar valor de dosis
  const valEl = document.querySelector(".dosis-int-val");
  if (valEl) {
    valEl.textContent = formatNum(dosisFinal, dosisFinal < 1 ? 3 : dosisFinal < 10 ? 2 : 1);
    if (topeOk) {
      valEl.classList.remove("dosis-int-val--alerta");
    } else {
      valEl.classList.add("dosis-int-val--alerta");
    }
  }

  // Actualizar total/día
  const totDia = document.querySelector(".dosis-int-vol-val");
  if (totDia && dosisDia !== null) totDia.textContent = formatNum(dosisDia, 1);

  // Actualizar volúmenes de preparados
  const preps = pauta.preparados || [];
  document.querySelectorAll(".dosis-int-prep-item").forEach(function(item, i) {
    const p = preps[i];
    if (!p) return;
    const volEl = item.querySelector(".dosis-int-prep-vol");
    if (volEl) volEl.textContent = formatNum(dosisFinal / p.conc_mg_ml, 2) + " ml";
  });
}
function onAjusteFino(slider) {
  factorInt = parseFloat(slider.value);
  // Al soltar: re-render completo para actualizar el resto de la UI (calc text, etc.)
  if (farmSeleccionado && modoAdmin === "intermitente") renderPanel();
}

// ============================================================
//  MODO: PERFUSIÓN CONTINUA (lógica clonada de Perfusiones)
// ============================================================
function renderModoPerfusion(f) {
  if (!f.presentaciones || f.presentaciones.length === 0) return;
  const pres = f.presentaciones[presIndex];
  const necesitaPeso = ["mcg_kg_min", "mcg_kg_h", "mg_kg_h"].indexOf(pres.calcTipo) >= 0;
  document.getElementById("aviso-peso").style.display = (necesitaPeso && !pesoActual) ? "flex" : "none";

  document.getElementById("calculadora-section").style.display = "flex";
  document.getElementById("info-collapse").style.display = "flex";
  document.getElementById("info-toggle-label").textContent = "Detalles de la dilución";

  renderInfoDilucion(pres);
  actualizarModoUI(pres);
  precargarYCalcular(pres);
}

function renderInfoDilucion(pres) {
  const conc = calcConcentracion(pres);
  document.getElementById("info-grid").innerHTML = '<div class="info-item">' +
      '<div class="info-label">Suero / Vehículo</div>' +
      '<div class="info-val">' + pres.suero + '</div>' +
    '</div>' +
    '<div class="info-item">' +
      '<div class="info-label">Dosis estándar</div>' +
      '<div class="info-val">' + pres.dosis_mg + ' mg</div>' +
    '</div>' +
    '<div class="info-item">' +
      '<div class="info-label">Volumen total</div>' +
      '<div class="info-val">' + pres.dilucion_ml + ' ml</div>' +
    '</div>' +
    '<div class="info-item">' +
      '<div class="info-label">Concentración</div>' +
      '<div class="info-val info-val--cyan">' + conc.texto + '</div>' +
    '</div>' +
    '<div class="info-item info-item--full">' +
      '<div class="info-label">Rango de dosis recomendado</div>' +
      '<div class="info-val info-val--rango">' + pres.dosisRange + '</div>' +
    '</div>';
}

function precargarYCalcular(pres) {
  const inputVal = document.getElementById("valor-input");
  if (pres.dosisMin && pres.dosisMin > 0) {
    inputVal.value = String(pres.dosisMin).replace(".", ",");
    setTimeout(function() { return calcular(); }, 0);
  } else {
    inputVal.value = "";
    limpiarCalc();
  }
}

function actualizarModoUI(pres) {
  const btnDosis = document.getElementById("btn-modo-dosis");
  const btnMl    = document.getElementById("btn-modo-ml");
  const labelInp = document.getElementById("label-input");
  const unitInp  = document.getElementById("unit-input");

  btnDosis.classList.toggle("modo--activo", modoCalculo === "dosis");
  btnMl.classList.toggle("modo--activo",    modoCalculo === "ml");

  labelInp.textContent = modoCalculo === "dosis" ? "Dosis deseada" : "Ritmo de bomba";
  unitInp.textContent  = modoCalculo === "dosis" ? pres.unidad     : "ml/h";

  btnDosis.onclick = function() { modoCalculo = "dosis"; actualizarModoUI(pres); limpiarCalc(); };
  btnMl.onclick    = function() { modoCalculo = "ml";    actualizarModoUI(pres); limpiarCalc(); };
}

// ── Cálculo perfusión ─────────────────────────────────────
function calcular() {
  if (!farmSeleccionado) return;
  if (modoAdmin !== "perfusion" && modoAdmin !== "carga_mantenimiento") return;

  const pres = farmSeleccionado.presentaciones[presIndex];
  if (!pres) return;
  const inputStr = document.getElementById("valor-input").value.replace(",", ".");
  const valor    = parseFloat(inputStr);
  const necesitaPeso = ["mcg_kg_min", "mcg_kg_h", "mg_kg_h"].indexOf(pres.calcTipo) >= 0;
  const box = document.getElementById("resultado-box");

  if (isNaN(valor) || valor <= 0) { mostrarError(box, "Introduce un valor numérico válido."); return; }
  if (necesitaPeso && !pesoActual) { mostrarError(box, "Es necesario introducir el peso del paciente."); return; }

  var mlH, dosis;
  if (modoCalculo === "dosis") { dosis = valor; mlH = calcMlH(pres, dosis, pesoActual); }
  else { mlH = valor; dosis = calcDosis(pres, mlH, pesoActual); }

  if (mlH === null || dosis === null || mlH <= 0) { mostrarError(box, "Error en el cálculo. Revisa los datos."); return; }

  var alertaDosis = null;
  const softMax = pres.softMax || pres.dosisMax;
  const hardMax = pres.hardMax;
  if (hardMax && dosis > hardMax)              alertaDosis = "peligro";
  else if (softMax && dosis > softMax)         alertaDosis = "alto";
  else if (pres.dosisMin && dosis < pres.dosisMin) alertaDosis = "bajo";

  mostrarResultado(box, pres, mlH, dosis, alertaDosis);
}

function calcMlH(pres, dosis, peso) {
  const concMg = pres.concMgMl || (pres.concUgMl / 1000);
  const concUg = pres.concUgMl || (pres.concMgMl * 1000);
  switch (pres.calcTipo) {
    case "mcg_kg_min": return (dosis * peso * 60) / concUg;
    case "mcg_kg_h":   return (dosis * peso)       / concUg;
    case "mg_kg_h":    return (dosis * peso)        / concMg;
    case "mcg_min":    return (dosis * 60)          / concUg;
    case "mcg_h":      return  dosis                / concUg;
    case "mg_h":       return  dosis                / concMg;
    case "mg_min":     return (dosis * 60)          / concMg;
    default: return null;
  }
}
function calcDosis(pres, mlH, peso) {
  const concMg = pres.concMgMl || (pres.concUgMl / 1000);
  const concUg = pres.concUgMl || (pres.concMgMl * 1000);
  switch (pres.calcTipo) {
    case "mcg_kg_min": return (mlH * concUg) / (peso * 60);
    case "mcg_kg_h":   return (mlH * concUg) / peso;
    case "mg_kg_h":    return (mlH * concMg) / peso;
    case "mcg_min":    return (mlH * concUg) / 60;
    case "mcg_h":      return  mlH * concUg;
    case "mg_h":       return  mlH * concMg;
    case "mg_min":     return (mlH * concMg) / 60;
    default: return null;
  }
}

function mostrarResultado(box, pres, mlH, dosis, alertaDosis) {
  const tiempoTexto = tiempoRestante(pres.dilucion_ml, mlH);
  var boxClass = "resultado-box resultado-box--ok";
  var alertaHtml = "";
  var alertaValClass = "";

  if (alertaDosis === "peligro") {
    boxClass = "resultado-box resultado-box--error";
    alertaValClass = "alerta-peligro";
    alertaHtml = '<div class="res-alerta res-alerta--peligro"><span class="res-alerta-ico">🛑</span><span><b>DOSIS TÓXICA:</b> Supera el límite de seguridad (' + pres.hardMax + ' ' + pres.unidad + ').</span></div>';
  } else if (alertaDosis === "alto") {
    boxClass = "resultado-box resultado-box--alerta";
    alertaValClass = "alerta-alto";
    alertaHtml = '<div class="res-alerta res-alerta--alto"><span class="res-alerta-ico">⚠️</span><span><b>Dosis alta:</b> Supera el rango habitual (máx. ' + (pres.softMax || pres.dosisMax) + ' ' + pres.unidad + ').</span></div>';
  } else if (alertaDosis === "bajo") {
    boxClass = "resultado-box resultado-box--alerta";
    alertaValClass = "alerta-bajo";
    alertaHtml = '<div class="res-alerta res-alerta--bajo"><span class="res-alerta-ico">ℹ️</span><span><b>Dosis baja:</b> Por debajo del rango habitual (mín. ' + pres.dosisMin + ' ' + pres.unidad + ').</span></div>';
  }

  // ── Slider de seguridad ────────────────────────────────
  const softMax  = pres.softMax || pres.dosisMax;
  const hardMax  = pres.hardMax;
  const dosisMin = pres.dosisMin;
  var safetyHtml = "";
  if (softMax || dosisMin) {
    const sliderMax = hardMax ? hardMax * 1.2 : (softMax ? softMax * 1.5 : dosis * 3);
    const safePct   = softMax ? (softMax / sliderMax) * 100 : null;
    const hardPct   = hardMax ? (hardMax / sliderMax) * 100 : null;
    const sliderVal = Math.min(dosis, sliderMax);
    const range     = sliderMax;
    const step      = range <= 2 ? 0.01 : range <= 20 ? 0.1 : 1;

    var gradient = "";
    if (safePct && hardPct) {
      gradient = "linear-gradient(to right, var(--green) 0%, var(--green) " + safePct.toFixed(1) + "%, var(--amber) " + safePct.toFixed(1) + "%, var(--amber) " + hardPct.toFixed(1) + "%, var(--red) " + hardPct.toFixed(1) + "%, var(--red) 100%)";
    } else if (safePct) {
      gradient = "linear-gradient(to right, var(--green) 0%, var(--green) " + safePct.toFixed(1) + "%, var(--amber) " + safePct.toFixed(1) + "%, var(--amber) 100%)";
    } else {
      gradient = "var(--green)";
    }

    var etiq = "";
    if (alertaDosis === "alto") etiq = "▲ Alto";
    else if (alertaDosis === "bajo") etiq = "▼ Bajo";
    else if (alertaDosis === "peligro") etiq = "⚠ Tóxico";
    else etiq = "✓ En rango";

    safetyHtml = '<div class="res-safety-wrap">' +
      '<div class="res-safety-header">' +
        '<span class="res-safety-titulo">Ajuste de dosis · ' + pres.unidad + '</span>' +
        '<span class="res-safety-etiqueta res-safety-etiqueta--' + (alertaDosis || "ok") + '">' + etiq + '</span>' +
      '</div>' +
      '<input type="range" class="safety-slider"' +
        'min="0" max="' + sliderMax.toFixed(3) + '"' +
        'value="' + sliderVal.toFixed(3) + '"' +
        'step="' + step + '"' +
        'style="--slider-gradient: ' + gradient + '"' +
        'oninput="onSafetySliderInput(this)"' +
        'onchange="onSafetySlider(this)">' +
      '<div class="res-safety-zones">' +
        '<span>0</span>' +
        (softMax ? '<span>' + formatNum(softMax, 2) + '</span>' : "") +
        (hardMax ? '<span>' + formatNum(hardMax, 2) + '</span>' : "") +
      '</div>' +
    '</div>';
  }

  const mlHTexto = formatNum(mlH, 2);
  box.className = boxClass;
  box.innerHTML = '<div class="res-principal">' +
      '<div class="res-item res-item--grande">' +
        '<span class="res-label">Ritmo de bomba</span>' +
        '<div class="res-valor-wrap">' +
          '<span class="res-valor">' + mlHTexto + '</span>' +
          '<button class="btn-copiar" onclick="copiarResultado(\'' + mlHTexto + ' ml/h\')" title="Copiar">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/></svg>' +
            'Copiar' +
          '</button>' +
        '</div>' +
        '<span class="res-unit">ml / h</span>' +
      '</div>' +
      '<div class="res-divider"></div>' +
      '<div class="res-item">' +
        '<span class="res-label">Dosis real</span>' +
        '<span class="res-valor ' + alertaValClass + '">' + formatNum(dosis, 3) + '</span>' +
        '<span class="res-unit">' + pres.unidad + '</span>' +
      '</div>' +
    '</div>' +
    alertaHtml +
    safetyHtml +
    '<div class="res-extras">' +
      '<div class="res-extra-item">' +
        '<span class="res-extra-label">⏱ Bolsa</span>' +
        '<span class="res-extra-val">' + tiempoTexto + '</span>' +
      '</div>' +
      '<div class="res-extra-item">' +
        '<span class="res-extra-label">🧪 Conc.</span>' +
        '<span class="res-extra-val">' + calcConcentracion(pres).texto + '</span>' +
      '</div>' +
      (pesoActual ? '<div class="res-extra-item">' +
        '<span class="res-extra-label">⚖️ Peso</span>' +
        '<span class="res-extra-val">' + pesoActual + ' kg</span>' +
      '</div>' : "") +
    '</div>';
}
function mostrarError(box, msg) {
  box.className = "resultado-box resultado-box--error";
  box.innerHTML = '<div class="res-error"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>' + msg + '</span></div>';
}

// ============================================================
//  MODO: CARGA + MANTENIMIENTO
// ============================================================
function renderModoCargaMant(f) {
  if (f.carga) renderCargaBox(f);
  if (f.presentaciones && f.presentaciones.length > 0) {
    const pres = f.presentaciones[presIndex];
    const necesitaPeso = ["mcg_kg_min", "mcg_kg_h", "mg_kg_h"].indexOf(pres.calcTipo) >= 0;
    document.getElementById("aviso-peso").style.display = (necesitaPeso && !pesoActual) ? "flex" : "none";
    document.getElementById("calculadora-section").style.display = "flex";
    document.getElementById("info-collapse").style.display = "flex";
    document.getElementById("info-toggle-label").textContent = "Detalles de la dilución";
    renderInfoDilucion(pres);
    actualizarModoUI(pres);
    precargarYCalcular(pres);
  }
}

function renderCargaBox(f) {
  const box = document.getElementById("carga-box");
  if (!f.carga) { box.style.display = "none"; return; }
  box.style.display = "block";
  const c = f.carga;
  const dosisEspecial = calcularDosisEspecial(c);
  const sinPeso = !pesoActual && !!(c.dosis_mcg_kg || c.dosis_mg_kg);

  var dosisTextoHtml = "";
  if (dosisEspecial.dosisTexto) {
    dosisTextoHtml = '<div class="dosis-especial-resultado">' +
      '<span class="dosis-especial-val">' + dosisEspecial.dosisTexto + '</span>' +
      (dosisEspecial.dosisCalc ? '<span class="dosis-especial-calc">' + dosisEspecial.dosisCalc + '</span>' : "") +
    '</div>';
  }

  box.innerHTML = '<div class="dosis-especial-box dosis-especial-box--carga">' +
    '<div class="dosis-especial-header">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span>Dosis de Carga</span>' +
      '<span class="dosis-especial-desc">' + (c.descripcion || "") + '</span>' +
    '</div>' +
    (sinPeso ? '<div class="dosis-especial-aviso">Introduce el peso para calcular la dosis</div>' : "") +
    dosisTextoHtml +
    '<div class="dosis-especial-detalles">' +
      (c.tiempo_min ? '<div class="dosis-det-item"><span class="dosis-det-label">Duración</span><span class="dosis-det-val">' + c.tiempo_min + ' min</span></div>' : '<div class="dosis-det-item"><span class="dosis-det-label">Duración</span><span class="dosis-det-val">Bolo</span></div>') +
      '<div class="dosis-det-item"><span class="dosis-det-label">Vía</span><span class="dosis-det-val">' + (c.via || "—") + '</span></div>' +
    '</div>' +
    (c.nota ? '<div class="dosis-especial-nota">' + c.nota + '</div>' : "") +
  '</div>';
}

// ============================================================
//  MODO: PUNTUAL
// ============================================================
function renderModoPuntual(f) {
  const box = document.getElementById("puntual-box");
  box.style.display = "block";
  if (!f.puntual) {
    box.innerHTML = '<div class="dosis-int-nota">Sin datos de dosis puntual para este fármaco.</div>';
    return;
  }
  const p = f.puntual;
  const dosisEspecial = calcularDosisEspecial(p);
  const sinPeso = !pesoActual && !!(p.dosis_mcg_kg || p.dosis_mg_kg);

  var dosisTextoHtml = "";
  if (dosisEspecial.dosisTexto) {
    dosisTextoHtml = '<div class="dosis-especial-resultado">' +
      '<span class="dosis-especial-val">' + dosisEspecial.dosisTexto + '</span>' +
      (dosisEspecial.dosisCalc ? '<span class="dosis-especial-calc">' + dosisEspecial.dosisCalc + '</span>' : "") +
    '</div>';
  }

  box.innerHTML = '<div class="dosis-especial-box dosis-especial-box--puntual">' +
    '<div class="dosis-especial-header">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span>Dosis Puntual</span>' +
      '<span class="dosis-especial-desc">' + (p.descripcion || "") + '</span>' +
    '</div>' +
    (sinPeso ? '<div class="dosis-especial-aviso">Introduce el peso para calcular la dosis</div>' : "") +
    dosisTextoHtml +
    '<div class="dosis-especial-detalles">' +
      '<div class="dosis-det-item dosis-det-item--full"><span class="dosis-det-label">Administración</span><span class="dosis-det-val">' + (p.via || "—") + '</span></div>' +
    '</div>' +
    (p.nota ? '<div class="dosis-especial-nota">' + p.nota + '</div>' : "") +
  '</div>';
}

function calcularDosisEspecial(d) {
  var dosisVal = null, dosisTexto = "", dosisCalc = "";
  if (d.dosis_mcg_kg && pesoActual) {
    dosisVal = d.dosis_mcg_kg * pesoActual;
    const enMg = dosisVal / 1000;
    if (enMg >= 1) { dosisTexto = formatNum(enMg, 2) + " mg"; dosisCalc = d.dosis_mcg_kg + " mcg/kg × " + pesoActual + " kg = " + formatNum(dosisVal, 0) + " mcg"; }
    else { dosisTexto = formatNum(dosisVal, 0) + " mcg"; dosisCalc = d.dosis_mcg_kg + " mcg/kg × " + pesoActual + " kg"; }
  } else if (d.dosis_mg_kg && pesoActual) {
    dosisVal = d.dosis_mg_kg * pesoActual;
    if (d.dosis_max_mg && dosisVal > d.dosis_max_mg) dosisVal = d.dosis_max_mg;
    dosisTexto = formatNum(dosisVal, 2) + " mg";
    dosisCalc  = d.dosis_mg_kg + " mg/kg × " + pesoActual + " kg" + (d.dosis_max_mg ? " · máx. " + d.dosis_max_mg + " mg" : "");
  } else if (d.dosis_fija_mg !== undefined) {
    dosisVal = d.dosis_fija_mg;
    if (dosisVal < 1) dosisTexto = formatNum(dosisVal * 1000, 0) + " mcg";
    else dosisTexto = formatNum(dosisVal, dosisVal < 10 ? 2 : 0) + " mg";
  }
  return { dosisVal: dosisVal, dosisTexto: dosisTexto, dosisCalc: dosisCalc };
}

// ============================================================
//  INFORMACIÓN CLÍNICA
// ============================================================
function renderInfoClinica(f) {
  const section = document.getElementById("clinica-section");
  if (!f.info) { section.style.display = "none"; return; }
  section.style.display = "flex";
  document.querySelectorAll(".clinica-tab").forEach(function(b) {
    var isActive = (b.dataset.tab === clinicaTab);
    if (isActive) {
      b.classList.add("clinica-tab--activa");
    } else {
      b.classList.remove("clinica-tab--activa");
    }
  });
  const fEl = document.getElementById("clinica-fuente");
  var fuenteTexto = "";
  if (f.fuente) {
    fuenteTexto = "Fuente: " + f.fuente + ". Verificar siempre con protocolos locales.";
  } else {
    fuenteTexto = "Información de referencia. Verificar siempre con protocolos locales.";
  }
  fEl.textContent = fuenteTexto;
  renderContenidoClinica();
}
function renderContenidoClinica() {
  if (!farmSeleccionado || !farmSeleccionado.info) return;
  const items = farmSeleccionado.info[clinicaTab] || [];
  const cont  = document.getElementById("clinica-contenido");
  const iconos = { indicaciones: "✓", contraindicaciones: "✕", precauciones: "!" };
  const ico = iconos[clinicaTab] || "·";
  cont.innerHTML = items.map(function(item) {
    return '<div class="clinica-item clinica-item--' + clinicaTab + '">' +
      '<span class="clinica-bullet">' + ico + '</span>' +
      '<span>' + item + '</span>' +
    '</div>';
  }).join("") || '<div class="clinica-item" style="color:var(--text-3);">Sin datos en este apartado.</div>';
}

// ============================================================
//  UTILIDADES
// ============================================================
function calcConcentracion(pres) {
  if (pres.concMgMl !== undefined)
    return { valor: pres.concMgMl, texto: formatNum(pres.concMgMl, 3) + " mg/ml" };
  if (pres.concUgMl !== undefined)
    return { valor: pres.concUgMl, texto: formatNum(pres.concUgMl, 2) + " mcg/ml" };
  return { valor: 0, texto: "—" };
}
function tiempoRestante(volMl, mlH) {
  if (!mlH || mlH <= 0) return "—";
  const horas = volMl / mlH;
  if (horas >= 24) return (horas / 24).toFixed(1) + " días";
  if (horas >= 1)  return Math.floor(horas) + "h " + Math.round((horas % 1) * 60) + "min";
  return Math.round(horas * 60) + " min";
}
function formatNum(n, decimals) {
  if (decimals === undefined) decimals = 2;
  if (n === null || isNaN(n)) return "—";
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: decimals, minimumFractionDigits: 0 }).format(n);
}
// ── Slider de seguridad ───────────────────────────────────
function onSafetySliderInput(slider) {
  const val      = parseFloat(slider.value);
  const step     = parseFloat(slider.step);
  var decimals = 2;
  if (step < 0.05) decimals = 2;
  else if (step < 1) decimals = 1;
  else decimals = 0;
  const rounded  = parseFloat(val.toFixed(decimals));
  document.getElementById("valor-input").value = String(rounded).replace(".", ",");
}
function onSafetySlider(slider) {
  const val      = parseFloat(slider.value);
  const step     = parseFloat(slider.step);
  var decimals = 2;
  if (step < 0.05) decimals = 2;
  else if (step < 1) decimals = 1;
  else decimals = 0;
  const rounded  = parseFloat(val.toFixed(decimals));
  document.getElementById("valor-input").value = String(rounded).replace(".", ",");
  if (modoCalculo !== "dosis") {
    modoCalculo = "dosis";
    const pres = farmSeleccionado && farmSeleccionado.presentaciones[presIndex];
    if (pres) actualizarModoUI(pres);
  }
  calcular();
}

function copiarResultado(texto) {
  if (!navigator.clipboard) { mostrarToast("Copia no disponible", "error"); return; }
  navigator.clipboard.writeText(texto)
    .then(function() { return mostrarToast("Copiado: " + texto, "ok"); })
    .catch(function() { return mostrarToast("No se pudo copiar", "error"); });
}
function mostrarToast(mensaje, tipo) {
  const c = document.getElementById("toast-container");
  if (!c) return;
  const t = document.createElement("div");
  t.className = "toast" + (tipo === "ok" ? " toast--ok" : "");
  t.textContent = mensaje;
  c.appendChild(t);
  setTimeout(function() { return t.remove(); }, 2100);
}