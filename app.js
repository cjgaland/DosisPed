// ============================================================
//  app.js — DosisPed · Calculadora pediátrica
//  Adaptado de Perfusiones UCI · soporte oral/IV intermitente,
//  perfusión continua, carga/mantenimiento y dosis puntual.
// ============================================================

/* jshint esversion: 6 */

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

  // Service Worker (PWA)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
    navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload());
  }

  // Modal de bienvenida (primer arranque)
  if (!localStorage.getItem(KEY_BIENV)) {
    document.getElementById("modal-bienvenida").style.display = "flex";
  }

  // Restaurar último fármaco abierto
  const ultimoNombre = localStorage.getItem(KEY_ULTIMO);
  if (ultimoNombre) {
    const f = farmacos.find(x => x.nombre === ultimoNombre);
    if (f) seleccionarFarmaco(f);
  }
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
  ["peso-input", "peso-panel-input"].forEach(id => {
    const el = document.getElementById(id);
    if (el && pesoActual !== null) el.value = String(pesoActual).replace(".", ",");
  });
  ["edad-input", "edad-panel-input"].forEach(id => {
    const el = document.getElementById(id);
    if (el && edadValor !== null) el.value = String(edadValor).replace(".", ",");
  });
  ["edad-unidad", "edad-panel-unidad"].forEach(id => {
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

  pesoIds.forEach(id => {
    const inp = document.getElementById(id);
    if (!inp) return;
    inp.addEventListener("input", () => {
      const v = parseFloat(inp.value.replace(",", "."));
      pesoActual = (v > 0 && v <= 200) ? v : null;
      pesoIds.forEach(o => { if (o !== id) { const e = document.getElementById(o); if (e) e.value = inp.value; } });
      if (pesoActual !== null) localStorage.setItem(KEY_PESO, String(pesoActual));
      else localStorage.removeItem(KEY_PESO);
      onPacienteCambio();
    });
  });

  edadIds.forEach(id => {
    const inp = document.getElementById(id);
    if (!inp) return;
    inp.addEventListener("input", () => {
      const v = parseFloat(inp.value.replace(",", "."));
      edadValor = (v >= 0) ? v : null;
      edadIds.forEach(o => { if (o !== id) { const e = document.getElementById(o); if (e) e.value = inp.value; } });
      if (edadValor !== null) localStorage.setItem(KEY_EDAD, String(edadValor));
      else localStorage.removeItem(KEY_EDAD);
      onPacienteCambio();
    });
  });

  uniIds.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.addEventListener("change", () => {
      edadUnidad = sel.value;
      uniIds.forEach(o => { if (o !== id) { const e = document.getElementById(o); if (e) e.value = edadUnidad; } });
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

  btn.addEventListener("click", () => {
    modoNeonato = !modoNeonato;
    btn.classList.toggle("btn-neonato--activo", modoNeonato);
    panel.style.display = modoNeonato ? "block" : "none";
    localStorage.setItem(KEY_NEONATO, modoNeonato ? "true" : "false");
    if (modoNeonato && edadValor === null) {
      edadValor = 0; edadUnidad = "dias";
      ["edad-input", "edad-panel-input"].forEach(id => { const e = document.getElementById(id); if (e) e.value = "0"; });
      ["edad-unidad", "edad-panel-unidad"].forEach(id => { const e = document.getElementById(id); if (e) e.value = "dias"; });
      localStorage.setItem(KEY_EDAD, "0");
      localStorage.setItem(KEY_EDAD_UN, "dias");
    }
    onPacienteCambio();
  });

  cerrar.addEventListener("click", () => {
    modoNeonato = false;
    btn.classList.remove("btn-neonato--activo");
    panel.style.display = "none";
    localStorage.setItem(KEY_NEONATO, "false");
    onPacienteCambio();
  });

  egInp.addEventListener("input", () => {
    const v = parseFloat(egInp.value.replace(",", "."));
    egSemanas = (v >= 22 && v <= 45) ? v : null;
    if (egSemanas !== null) localStorage.setItem(KEY_EG, String(egSemanas));
    else localStorage.removeItem(KEY_EG);
    onPacienteCambio();
  });
  epnInp.addEventListener("input", () => {
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

  document.getElementById("btn-modal-aceptar").addEventListener("click", () => {
    const noRepetir = document.getElementById("modal-no-repetir").checked;
    if (noRepetir) localStorage.setItem(KEY_BIENV, "1");
    overlay.style.display = "none";
  });
  overlay.addEventListener("click", e => {
    if (e.target === overlay) {
      // sólo cerrar pulsando el botón; clic en overlay sólo lo cierra si ya se aceptó antes
      if (localStorage.getItem(KEY_BIENV)) overlay.style.display = "none";
    }
  });

  document.getElementById("btn-info-app").addEventListener("click", () => {
    fuentes.style.display = "flex";
  });
  document.getElementById("btn-cerrar-fuentes").addEventListener("click", () => {
    fuentes.style.display = "none";
  });
  fuentes.addEventListener("click", e => { if (e.target === fuentes) fuentes.style.display = "none"; });
}

// ============================================================
//  HISTORIAL DE SESIÓN (sessionStorage)
// ============================================================
function leerHistorial() {
  try { return JSON.parse(sessionStorage.getItem(KEY_HIST) || "[]"); }
  catch { return []; }
}
function registrarHistorial(f) {
  const lista = leerHistorial().filter(x => x.nombre !== f.nombre);
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
    cont.innerHTML = `<div class="historial-vacio">Sin cálculos en esta sesión todavía.</div>`;
    return;
  }
  cont.innerHTML = lista.map(item => {
    const min = Math.round((Date.now() - item.ts) / 60000);
    const tiempo = min < 1 ? "ahora" : min < 60 ? `hace ${min} min` : `hace ${Math.floor(min/60)} h`;
    return `<div class="historial-item" onclick="abrirDesdeHistorial('${item.nombre.replace(/'/g, "\\'")}')">
      <span class="historial-item-icono">${item.icono}</span>
      <div class="historial-item-info">
        <span class="historial-item-nombre">${item.nombre}</span>
        <span class="historial-item-cat">${item.categoria}</span>
      </div>
      <span class="historial-item-time">${tiempo}</span>
    </div>`;
  }).join("");
}
function abrirDesdeHistorial(nombre) {
  document.getElementById("historial-dropdown").style.display = "none";
  const f = farmacos.find(x => x.nombre === nombre);
  if (f) seleccionarFarmaco(f);
}

// ============================================================
//  FAVORITOS
// ============================================================
function toggleFavorito(nombre) {
  if (favoritos.has(nombre)) favoritos.delete(nombre);
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
  btnFav.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:-1px;margin-right:3px"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>Favoritos`;
  btnFav.addEventListener("click", () => {
    categoriaFiltro = "Favoritos";
    document.querySelectorAll("#filtros .chip").forEach(b => b.classList.remove("chip--activo"));
    btnFav.classList.add("chip--activo");
    renderizarLista(document.getElementById("busqueda").value);
  });
  cont.appendChild(btnFav);

  const todas = ["Todos", ...categorias];
  todas.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat === categoriaFiltro ? " chip--activo" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      categoriaFiltro = cat;
      document.querySelectorAll("#filtros .chip").forEach(b => b.classList.remove("chip--activo"));
      btn.classList.add("chip--activo");
      renderizarLista(document.getElementById("busqueda").value);
    });
    cont.appendChild(btn);
  });
}

function renderizarLista(query = "") {
  const cont = document.getElementById("lista-farmacos");
  cont.innerHTML = "";
  const q = query.toLowerCase().trim();

  const lista = farmacos.filter(f => {
    if (categoriaFiltro === "Favoritos") {
      return favoritos.has(f.nombre) &&
        (!q || f.nombre.toLowerCase().includes(q) || f.categoria.toLowerCase().includes(q));
    }
    const matchCat = categoriaFiltro === "Todos" || f.categoria === categoriaFiltro;
    const matchQ   = !q || f.nombre.toLowerCase().includes(q) || f.categoria.toLowerCase().includes(q)
                       || (f.sinonimos && f.sinonimos.some(s => s.toLowerCase().includes(q)));
    return matchCat && matchQ;
  });

  if (lista.length === 0) {
    cont.innerHTML = categoriaFiltro === "Favoritos"
      ? `<p class="sin-resultados">No hay favoritos guardados.<br><small>Abre un fármaco y pulsa la estrella ☆</small></p>`
      : `<p class="sin-resultados">No se encontraron fármacos</p>`;
    return;
  }

  lista.forEach(f => {
    const card     = document.createElement("div");
    const esActiva = farmSeleccionado && farmSeleccionado.nombre === f.nombre;
    const esFav    = favoritos.has(f.nombre);
    card.className = "farm-card" + (esActiva ? " farm-card--activa" : "");
    card.style.setProperty("--card-iso-color", f.isoColor || "var(--border)");

    const vias = (f.vias || []).slice(0, 4).map(v =>
      `<span class="farm-via-badge farm-via-badge--${v.toLowerCase()}">${v.toUpperCase()}</span>`
    ).join("");

    card.innerHTML = `
      <div class="farm-iso-strip"></div>
      <span class="farm-icono">${f.icono || "💊"}</span>
      <div class="farm-info">
        <span class="farm-nombre">${f.nombre}</span>
        <span class="farm-cat">${f.categoria}</span>
        ${vias ? `<div class="farm-vias">${vias}</div>` : ""}
      </div>
      <div class="farm-card-right">
        ${esFav ? `<span class="farm-estrella">★</span>` : ""}
      </div>
    `;
    card.addEventListener("click", () => seleccionarFarmaco(f));
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
  document.getElementById("busqueda").addEventListener("input", e => {
    renderizarLista(e.target.value);
  });
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

  renderAdminModos(f);
  renderTabsSegunModo(f);

  // Ocultar todo, luego mostrar según modo
  ["dosis-int-box", "carga-box", "puntual-box", "calculadora-section", "info-collapse", "aviso-peso"].forEach(id => {
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
  f.modos.forEach(modo => {
    const btn = document.createElement("button");
    btn.className = "btn-admin-modo" + (modo === modoAdmin ? " admin-modo--activo" : "");
    btn.textContent = labelModo(modo);
    btn.addEventListener("click", () => {
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

  let items = [];
  let activeIdx = 0;
  let onClick = null;

  if (modoAdmin === "intermitente" && f.intermitente && f.intermitente.length > 1) {
    items = f.intermitente.map(p => p.indicacion || p.via || "Pauta");
    activeIdx = intIndex;
    onClick = (i) => { intIndex = i; prepIndex = 0; renderPanel(); };
  } else if (modoAdmin === "perfusion" && f.presentaciones && f.presentaciones.length > 1) {
    items = f.presentaciones.map(p => p.label);
    activeIdx = presIndex;
    onClick = (i) => { presIndex = i; renderPanel(); };
  }
  if (modoAdmin === "intermitente") {
    // Reset factor cuando cambia la pauta activa
    const tabsCambiados = (window._lastIntKey !== `${f.nombre}-${intIndex}`);
    if (tabsCambiados) { factorInt = 1.0; window._lastIntKey = `${f.nombre}-${intIndex}`; }
  }

  if (items.length === 0) { cont.style.display = "none"; return; }
  cont.style.display = "flex";
  items.forEach((label, i) => {
    const btn = document.createElement("button");
    btn.className = "tab-pres" + (i === activeIdx ? " tab-pres--activa" : "");
    btn.textContent = label;
    btn.addEventListener("click", () => onClick(i));
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
      `<div class="dosis-int-nota">Sin datos de dosis intermitente para este fármaco.</div>`;
    return;
  }
  const pauta = f.intermitente[intIndex];
  const necesitaPeso = pauta.dosis_mg_kg || pauta.dosis_mcg_kg || pauta.dosis_mg_kg_dia;
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
  let estado = "ok";
  let alertaHtml = "";
  if (calc.dosis !== null) {
    if (pauta.dosis_max_mg && calc.dosis > pauta.dosis_max_mg) {
      estado = "max";
      alertaHtml = `<div class="dosis-int-alerta dosis-int-alerta--max"><span>⚠️</span><span><b>Dosis máxima por toma:</b> ${formatNum(pauta.dosis_max_mg, 0)} mg. Se aplicará el tope.</span></div>`;
    }
  }
  if (calc.dosisDia !== null && pauta.dosis_max_dia_mg && calc.dosisDia > pauta.dosis_max_dia_mg) {
    alertaHtml += `<div class="dosis-int-alerta dosis-int-alerta--max"><span>⚠️</span><span><b>Dosis diaria máxima:</b> ${formatNum(pauta.dosis_max_dia_mg, 0)} mg/día. Tope aplicable.</span></div>`;
  }

  const viaBadge = pauta.via
    ? `<span class="dosis-int-via-badge farm-via-badge--${pauta.via.toLowerCase()}">${pauta.via.toUpperCase()}</span>`
    : "";

  // Aplicar factor de ajuste fino
  let dosisFinal = calc.dosis;
  if (dosisFinal !== null) dosisFinal = dosisFinal * factorInt;
  let dosisDiaConFactor = calc.dosisDiaFinal;
  if (dosisDiaConFactor !== null) dosisDiaConFactor = dosisDiaConFactor * factorInt;

  // Aplicar tope absoluto tras factor
  let topeAplicado = false;
  if (dosisFinal !== null && pauta.dosis_max_mg && dosisFinal > pauta.dosis_max_mg) {
    dosisFinal = pauta.dosis_max_mg;
    topeAplicado = true;
  }

  // Selector de preparado (si hay)
  const preparados = pauta.preparados || [];
  let preparadosHtml = "";
  if (preparados.length > 0 && dosisFinal !== null) {
    preparadosHtml = `
      <div class="dosis-int-preparados">
        <div class="dosis-int-preparados-label">Preparados comerciales · volumen por toma</div>
        <div class="dosis-int-prep-list">
          ${preparados.map((p, i) => {
            const vol = dosisFinal / p.conc_mg_ml;
            return `<div class="dosis-int-prep-item${i === prepIndex ? " dosis-int-prep-item--activo" : ""}" onclick="seleccionarPreparado(${i})">
              <div style="flex:1;min-width:0;">
                <div class="dosis-int-prep-nombre">${p.nombre}</div>
                <div class="dosis-int-prep-conc">${formatNum(p.conc_mg_ml, 2)} mg/ml</div>
              </div>
              <div class="dosis-int-prep-vol">${formatNum(vol, 2)} ml</div>
            </div>`;
          }).join("")}
        </div>
      </div>`;
  }

  // Detalles
  const detalles = [];
  if (pauta.intervalo_h) detalles.push({ l: "Intervalo", v: `cada ${pauta.intervalo_h} h` });
  if (pauta.dosis_mg_kg) detalles.push({ l: "Dosis", v: `${formatNum(pauta.dosis_mg_kg, 3)} mg/kg/dosis` });
  else if (pauta.dosis_mcg_kg) detalles.push({ l: "Dosis", v: `${formatNum(pauta.dosis_mcg_kg, 1)} mcg/kg/dosis` });
  else if (pauta.dosis_mg_kg_dia) detalles.push({ l: "Dosis", v: `${formatNum(pauta.dosis_mg_kg_dia, 2)} mg/kg/día` });
  if (pauta.dosis_max_mg)     detalles.push({ l: "Máx/toma",  v: `${formatNum(pauta.dosis_max_mg, 0)} mg` });
  if (pauta.dosis_max_dia_mg) detalles.push({ l: "Máx/día",   v: `${formatNum(pauta.dosis_max_dia_mg, 0)} mg` });
  if (pauta.duracion)         detalles.push({ l: "Duración",  v: pauta.duracion });

  // Slider de ajuste fino (solo si hay dosis calculada por peso)
  const muestraSlider = calc.dosis !== null && (pauta.dosis_mg_kg || pauta.dosis_mcg_kg || pauta.dosis_mg_kg_dia);
  let sliderHtml = "";
  if (muestraSlider) {
    const pct = Math.round(factorInt * 100);
    const sliderColor = factorInt < 0.85 ? "var(--cyan)" : factorInt > 1.15 ? "var(--amber)" : "var(--green)";
    sliderHtml = `
      <div class="ajuste-fino-wrap">
        <div class="ajuste-fino-header">
          <span class="ajuste-fino-label">Ajuste fino</span>
          <span class="ajuste-fino-valor" style="color:${sliderColor}">${pct}%${factorInt === 1 ? " (estándar)" : ""}</span>
        </div>
        <input type="range" class="ajuste-fino-slider"
          min="0.5" max="1.5" step="0.05"
          value="${factorInt}"
          oninput="onAjusteFinoInput(this)"
          onchange="onAjusteFino(this)">
        <div class="ajuste-fino-marcas">
          <span>0,5×</span><span>1×</span><span>1,5×</span>
        </div>
      </div>`;
  }

  let resHtml;
  if (calc.dosis !== null) {
    resHtml = `
      <div class="dosis-int-resultado">
        <span class="dosis-int-val${estado === "max" ? " dosis-int-val--alerta" : ""}">${formatNum(dosisFinal, dosisFinal < 1 ? 3 : dosisFinal < 10 ? 2 : 1)}</span>
        <span class="dosis-int-unidad">mg / toma${factorInt !== 1 ? ` <span style="color:${factorInt < 1 ? 'var(--cyan)' : 'var(--amber)'};font-weight:600;">· ${Math.round(factorInt*100)}%</span>` : ""}</span>
        ${calc.calcTexto ? `<span class="dosis-int-calc">${calc.calcTexto}${factorInt !== 1 ? ` × ${factorInt.toFixed(2).replace(".",",")}` : ""}</span>` : ""}
        ${calc.dosisDia !== null ? `
          <div class="dosis-int-vol">
            <span class="dosis-int-vol-label">Total día</span>
            <span class="dosis-int-vol-val">${formatNum(dosisDiaConFactor, 1)}</span>
            <span class="dosis-int-vol-unidad">mg/día · ${calc.tomasDia ? calc.tomasDia + " tomas" : ""}</span>
          </div>` : ""}
        ${sliderHtml}
      </div>`;
  } else {
    resHtml = `<div class="dosis-int-resultado"><span class="dosis-int-val" style="font-size:18px;color:var(--text-3);">Introduce el peso</span></div>`;
  }

  box.innerHTML = `
    <div class="dosis-int-header">
      <span class="dosis-int-titulo">Dosis pediátrica</span>
      ${viaBadge}
      <span class="dosis-int-indicacion">${pauta.indicacion || ""}</span>
    </div>
    ${resHtml}
    ${preparadosHtml}
    ${detalles.length ? `<div class="dosis-int-detalles">${detalles.map(d => `<div class="dosis-int-det"><span class="dosis-int-det-label">${d.l}</span><span class="dosis-int-det-val">${d.v}</span></div>`).join("")}</div>` : ""}
    ${alertaHtml}
    ${pauta.nota ? `<div class="dosis-int-nota">${pauta.nota}</div>` : ""}
  `;
}

function calcularDosisIntermitente(pauta) {
  let dosis = null;       // mg por toma
  let dosisDia = null;    // mg por día
  let calcTexto = "";
  let tomasDia = pauta.intervalo_h ? Math.round(24 / pauta.intervalo_h) : null;

  if (pauta.dosis_mg_kg && pesoActual) {
    dosis = pauta.dosis_mg_kg * pesoActual;
    calcTexto = `${formatNum(pauta.dosis_mg_kg, 3)} mg/kg × ${pesoActual} kg`;
    if (tomasDia) dosisDia = dosis * tomasDia;
  } else if (pauta.dosis_mcg_kg && pesoActual) {
    dosis = (pauta.dosis_mcg_kg * pesoActual) / 1000; // a mg
    calcTexto = `${formatNum(pauta.dosis_mcg_kg, 1)} mcg/kg × ${pesoActual} kg = ${formatNum(pauta.dosis_mcg_kg * pesoActual, 0)} mcg`;
    if (tomasDia) dosisDia = dosis * tomasDia;
  } else if (pauta.dosis_mg_kg_dia && pesoActual) {
    dosisDia = pauta.dosis_mg_kg_dia * pesoActual;
    if (tomasDia) {
      dosis = dosisDia / tomasDia;
      calcTexto = `${formatNum(pauta.dosis_mg_kg_dia, 2)} mg/kg/día × ${pesoActual} kg ÷ ${tomasDia} tomas`;
    } else {
      calcTexto = `${formatNum(pauta.dosis_mg_kg_dia, 2)} mg/kg/día × ${pesoActual} kg`;
    }
  } else if (pauta.dosis_fija_mg !== undefined) {
    dosis = pauta.dosis_fija_mg;
    calcTexto = "Dosis fija";
    if (tomasDia) dosisDia = dosis * tomasDia;
  }

  let dosisDiaFinal = dosisDia;
  if (dosisDia !== null && pauta.dosis_max_dia_mg && dosisDia > pauta.dosis_max_dia_mg) {
    dosisDiaFinal = pauta.dosis_max_dia_mg;
  }

  return { dosis, dosisDia, dosisDiaFinal, calcTexto, tomasDia };
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
  let dosisFinal = calc.dosis * factorInt;
  let topeOk = true;
  if (pauta.dosis_max_mg && dosisFinal > pauta.dosis_max_mg) { dosisFinal = pauta.dosis_max_mg; topeOk = false; }
  const dosisDia = calc.dosisDiaFinal !== null ? calc.dosisDiaFinal * factorInt : null;

  // Actualizar header del slider
  const pct = Math.round(factorInt * 100);
  const color = factorInt < 0.85 ? "var(--cyan)" : factorInt > 1.15 ? "var(--amber)" : "var(--green)";
  const valorEl = document.querySelector(".ajuste-fino-valor");
  if (valorEl) {
    valorEl.style.color = color;
    valorEl.textContent = `${pct}%${factorInt === 1 ? " (estándar)" : ""}`;
  }

  // Actualizar valor de dosis
  const valEl = document.querySelector(".dosis-int-val");
  if (valEl) {
    valEl.textContent = formatNum(dosisFinal, dosisFinal < 1 ? 3 : dosisFinal < 10 ? 2 : 1);
    valEl.classList.toggle("dosis-int-val--alerta", !topeOk);
  }

  // Actualizar total/día
  const totDia = document.querySelector(".dosis-int-vol-val");
  if (totDia && dosisDia !== null) totDia.textContent = formatNum(dosisDia, 1);

  // Actualizar volúmenes de preparados
  const preps = pauta.preparados || [];
  document.querySelectorAll(".dosis-int-prep-item").forEach((item, i) => {
    const p = preps[i];
    if (!p) return;
    const volEl = item.querySelector(".dosis-int-prep-vol");
    if (volEl) volEl.textContent = `${formatNum(dosisFinal / p.conc_mg_ml, 2)} ml`;
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
  const necesitaPeso = ["mcg_kg_min", "mcg_kg_h", "mg_kg_h"].includes(pres.calcTipo);
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
  document.getElementById("info-grid").innerHTML = `
    <div class="info-item">
      <div class="info-label">Suero / Vehículo</div>
      <div class="info-val">${pres.suero}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Dosis estándar</div>
      <div class="info-val">${pres.dosis_mg} mg</div>
    </div>
    <div class="info-item">
      <div class="info-label">Volumen total</div>
      <div class="info-val">${pres.dilucion_ml} ml</div>
    </div>
    <div class="info-item">
      <div class="info-label">Concentración</div>
      <div class="info-val info-val--cyan">${conc.texto}</div>
    </div>
    <div class="info-item info-item--full">
      <div class="info-label">Rango de dosis recomendado</div>
      <div class="info-val info-val--rango">${pres.dosisRange}</div>
    </div>
  `;
}

function precargarYCalcular(pres) {
  const inputVal = document.getElementById("valor-input");
  if (pres.dosisMin && pres.dosisMin > 0) {
    inputVal.value = String(pres.dosisMin).replace(".", ",");
    setTimeout(() => calcular(), 0);
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

  btnDosis.onclick = () => { modoCalculo = "dosis"; actualizarModoUI(pres); limpiarCalc(); };
  btnMl.onclick    = () => { modoCalculo = "ml";    actualizarModoUI(pres); limpiarCalc(); };
}

// ── Cálculo perfusión ─────────────────────────────────────
function calcular() {
  if (!farmSeleccionado) return;
  if (modoAdmin !== "perfusion" && modoAdmin !== "carga_mantenimiento") return;

  const pres = farmSeleccionado.presentaciones[presIndex];
  if (!pres) return;
  const inputStr = document.getElementById("valor-input").value.replace(",", ".");
  const valor    = parseFloat(inputStr);
  const necesitaPeso = ["mcg_kg_min", "mcg_kg_h", "mg_kg_h"].includes(pres.calcTipo);
  const box = document.getElementById("resultado-box");

  if (isNaN(valor) || valor <= 0) { mostrarError(box, "Introduce un valor numérico válido."); return; }
  if (necesitaPeso && !pesoActual) { mostrarError(box, "Es necesario introducir el peso del paciente."); return; }

  let mlH, dosis;
  if (modoCalculo === "dosis") { dosis = valor; mlH = calcMlH(pres, dosis, pesoActual); }
  else { mlH = valor; dosis = calcDosis(pres, mlH, pesoActual); }

  if (mlH === null || dosis === null || mlH <= 0) { mostrarError(box, "Error en el cálculo. Revisa los datos."); return; }

  let alertaDosis = null;
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
  let boxClass = "resultado-box resultado-box--ok";
  let alertaHtml = "";
  let alertaValClass = "";

  if (alertaDosis === "peligro") {
    boxClass = "resultado-box resultado-box--error";
    alertaValClass = "alerta-peligro";
    alertaHtml = `<div class="res-alerta res-alerta--peligro"><span class="res-alerta-ico">🛑</span><span><b>DOSIS TÓXICA:</b> Supera el límite de seguridad (${pres.hardMax} ${pres.unidad}).</span></div>`;
  } else if (alertaDosis === "alto") {
    boxClass = "resultado-box resultado-box--alerta";
    alertaValClass = "alerta-alto";
    alertaHtml = `<div class="res-alerta res-alerta--alto"><span class="res-alerta-ico">⚠️</span><span><b>Dosis alta:</b> Supera el rango habitual (máx. ${pres.softMax || pres.dosisMax} ${pres.unidad}).</span></div>`;
  } else if (alertaDosis === "bajo") {
    boxClass = "resultado-box resultado-box--alerta";
    alertaValClass = "alerta-bajo";
    alertaHtml = `<div class="res-alerta res-alerta--bajo"><span class="res-alerta-ico">ℹ️</span><span><b>Dosis baja:</b> Por debajo del rango habitual (mín. ${pres.dosisMin} ${pres.unidad}).</span></div>`;
  }

  // ── Slider de seguridad ────────────────────────────────
  const softMax  = pres.softMax || pres.dosisMax;
  const hardMax  = pres.hardMax;
  const dosisMin = pres.dosisMin;
  let safetyHtml = "";
  if (softMax || dosisMin) {
    const sliderMax = hardMax ? hardMax * 1.2 : (softMax ? softMax * 1.5 : dosis * 3);
    const safePct   = softMax ? (softMax / sliderMax) * 100 : null;
    const hardPct   = hardMax ? (hardMax / sliderMax) * 100 : null;
    const sliderVal = Math.min(dosis, sliderMax);
    const range     = sliderMax;
    const step      = range <= 2 ? 0.01 : range <= 20 ? 0.1 : 1;

    let gradient;
    if (safePct && hardPct) {
      gradient = `linear-gradient(to right, var(--green) 0%, var(--green) ${safePct.toFixed(1)}%, var(--amber) ${safePct.toFixed(1)}%, var(--amber) ${hardPct.toFixed(1)}%, var(--red) ${hardPct.toFixed(1)}%, var(--red) 100%)`;
    } else if (safePct) {
      gradient = `linear-gradient(to right, var(--green) 0%, var(--green) ${safePct.toFixed(1)}%, var(--amber) ${safePct.toFixed(1)}%, var(--amber) 100%)`;
    } else {
      gradient = `var(--green)`;
    }

    const etiquetas = { ok: "✓ En rango", alto: "▲ Alto", bajo: "▼ Bajo", peligro: "⚠ Tóxico" };
    const etiq      = etiquetas[alertaDosis || "ok"];

    safetyHtml = `
      <div class="res-safety-wrap">
        <div class="res-safety-header">
          <span class="res-safety-titulo">Ajuste de dosis · ${pres.unidad}</span>
          <span class="res-safety-etiqueta res-safety-etiqueta--${alertaDosis || "ok"}">${etiq}</span>
        </div>
        <input type="range" class="safety-slider"
          min="0" max="${sliderMax.toFixed(3)}"
          value="${sliderVal.toFixed(3)}"
          step="${step}"
          style="--slider-gradient: ${gradient}"
          oninput="onSafetySliderInput(this)"
          onchange="onSafetySlider(this)">
        <div class="res-safety-zones">
          <span>0</span>
          ${softMax ? `<span>${formatNum(softMax, 2)}</span>` : ""}
          ${hardMax ? `<span>${formatNum(hardMax, 2)}</span>` : ""}
        </div>
      </div>`;
  }

  const mlHTexto = formatNum(mlH, 2);
  box.className = boxClass;
  box.innerHTML = `
    <div class="res-principal">
      <div class="res-item res-item--grande">
        <span class="res-label">Ritmo de bomba</span>
        <div class="res-valor-wrap">
          <span class="res-valor">${mlHTexto}</span>
          <button class="btn-copiar" onclick="copiarResultado('${mlHTexto} ml/h')" title="Copiar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/></svg>
            Copiar
          </button>
        </div>
        <span class="res-unit">ml / h</span>
      </div>
      <div class="res-divider"></div>
      <div class="res-item">
        <span class="res-label">Dosis real</span>
        <span class="res-valor ${alertaValClass}">${formatNum(dosis, 3)}</span>
        <span class="res-unit">${pres.unidad}</span>
      </div>
    </div>
    ${alertaHtml}
    ${safetyHtml}
    <div class="res-extras">
      <div class="res-extra-item">
        <span class="res-extra-label">⏱ Bolsa</span>
        <span class="res-extra-val">${tiempoTexto}</span>
      </div>
      <div class="res-extra-item">
        <span class="res-extra-label">🧪 Conc.</span>
        <span class="res-extra-val">${calcConcentracion(pres).texto}</span>
      </div>
      ${pesoActual ? `<div class="res-extra-item">
        <span class="res-extra-label">⚖️ Peso</span>
        <span class="res-extra-val">${pesoActual} kg</span>
      </div>` : ""}
    </div>
  `;
}
function mostrarError(box, msg) {
  box.className = "resultado-box resultado-box--error";
  box.innerHTML = `<div class="res-error"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>${msg}</span></div>`;
}

// ============================================================
//  MODO: CARGA + MANTENIMIENTO
// ============================================================
function renderModoCargaMant(f) {
  if (f.carga) renderCargaBox(f);
  if (f.presentaciones && f.presentaciones.length > 0) {
    const pres = f.presentaciones[presIndex];
    const necesitaPeso = ["mcg_kg_min", "mcg_kg_h", "mg_kg_h"].includes(pres.calcTipo);
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
  const { dosisTexto, dosisCalc } = calcularDosisEspecial(c);
  const sinPeso = !pesoActual && (c.dosis_mcg_kg || c.dosis_mg_kg);

  box.innerHTML = `
    <div class="dosis-especial-box dosis-especial-box--carga">
      <div class="dosis-especial-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Dosis de Carga</span>
        <span class="dosis-especial-desc">${c.descripcion || ""}</span>
      </div>
      ${sinPeso ? `<div class="dosis-especial-aviso">Introduce el peso para calcular la dosis</div>` : ""}
      ${dosisTexto ? `
        <div class="dosis-especial-resultado">
          <span class="dosis-especial-val">${dosisTexto}</span>
          ${dosisCalc ? `<span class="dosis-especial-calc">${dosisCalc}</span>` : ""}
        </div>` : ""}
      <div class="dosis-especial-detalles">
        ${c.tiempo_min ? `<div class="dosis-det-item"><span class="dosis-det-label">Duración</span><span class="dosis-det-val">${c.tiempo_min} min</span></div>` : `<div class="dosis-det-item"><span class="dosis-det-label">Duración</span><span class="dosis-det-val">Bolo</span></div>`}
        <div class="dosis-det-item"><span class="dosis-det-label">Vía</span><span class="dosis-det-val">${c.via || "—"}</span></div>
      </div>
      ${c.nota ? `<div class="dosis-especial-nota">${c.nota}</div>` : ""}
    </div>
  `;
}

// ============================================================
//  MODO: PUNTUAL
// ============================================================
function renderModoPuntual(f) {
  const box = document.getElementById("puntual-box");
  box.style.display = "block";
  if (!f.puntual) {
    box.innerHTML = `<div class="dosis-int-nota">Sin datos de dosis puntual para este fármaco.</div>`;
    return;
  }
  const p = f.puntual;
  const { dosisTexto, dosisCalc } = calcularDosisEspecial(p);
  const sinPeso = !pesoActual && (p.dosis_mcg_kg || p.dosis_mg_kg);

  box.innerHTML = `
    <div class="dosis-especial-box dosis-especial-box--puntual">
      <div class="dosis-especial-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Dosis Puntual</span>
        <span class="dosis-especial-desc">${p.descripcion || ""}</span>
      </div>
      ${sinPeso ? `<div class="dosis-especial-aviso">Introduce el peso para calcular la dosis</div>` : ""}
      ${dosisTexto ? `
        <div class="dosis-especial-resultado">
          <span class="dosis-especial-val">${dosisTexto}</span>
          ${dosisCalc ? `<span class="dosis-especial-calc">${dosisCalc}</span>` : ""}
        </div>` : ""}
      <div class="dosis-especial-detalles">
        <div class="dosis-det-item dosis-det-item--full"><span class="dosis-det-label">Administración</span><span class="dosis-det-val">${p.via || "—"}</span></div>
      </div>
      ${p.nota ? `<div class="dosis-especial-nota">${p.nota}</div>` : ""}
    </div>
  `;
}

function calcularDosisEspecial(d) {
  let dosisVal = null, dosisTexto = "", dosisCalc = "";
  if (d.dosis_mcg_kg && pesoActual) {
    dosisVal = d.dosis_mcg_kg * pesoActual;
    const enMg = dosisVal / 1000;
    if (enMg >= 1) { dosisTexto = `${formatNum(enMg, 2)} mg`; dosisCalc = `${d.dosis_mcg_kg} mcg/kg × ${pesoActual} kg = ${formatNum(dosisVal, 0)} mcg`; }
    else { dosisTexto = `${formatNum(dosisVal, 0)} mcg`; dosisCalc = `${d.dosis_mcg_kg} mcg/kg × ${pesoActual} kg`; }
  } else if (d.dosis_mg_kg && pesoActual) {
    dosisVal = d.dosis_mg_kg * pesoActual;
    if (d.dosis_max_mg && dosisVal > d.dosis_max_mg) dosisVal = d.dosis_max_mg;
    dosisTexto = `${formatNum(dosisVal, 2)} mg`;
    dosisCalc  = `${d.dosis_mg_kg} mg/kg × ${pesoActual} kg${d.dosis_max_mg ? ` · máx. ${d.dosis_max_mg} mg` : ""}`;
  } else if (d.dosis_fija_mg !== undefined) {
    dosisVal = d.dosis_fija_mg;
    if (dosisVal < 1) dosisTexto = `${formatNum(dosisVal * 1000, 0)} mcg`;
    else dosisTexto = `${formatNum(dosisVal, dosisVal < 10 ? 2 : 0)} mg`;
  }
  return { dosisVal, dosisTexto, dosisCalc };
}

// ============================================================
//  INFORMACIÓN CLÍNICA
// ============================================================
function renderInfoClinica(f) {
  const section = document.getElementById("clinica-section");
  if (!f.info) { section.style.display = "none"; return; }
  section.style.display = "flex";
  document.querySelectorAll(".clinica-tab").forEach(b => {
    b.classList.toggle("clinica-tab--activa", b.dataset.tab === clinicaTab);
  });
  const fEl = document.getElementById("clinica-fuente");
  fEl.textContent = f.fuente
    ? `Fuente: ${f.fuente}. Verificar siempre con protocolos locales.`
    : "Información de referencia. Verificar siempre con protocolos locales.";
  renderContenidoClinica();
}
function renderContenidoClinica() {
  if (!farmSeleccionado || !farmSeleccionado.info) return;
  const items = farmSeleccionado.info[clinicaTab] || [];
  const cont  = document.getElementById("clinica-contenido");
  const iconos = { indicaciones: "✓", contraindicaciones: "✕", precauciones: "!" };
  const ico = iconos[clinicaTab] || "·";
  cont.innerHTML = items.map(item => `
    <div class="clinica-item clinica-item--${clinicaTab}">
      <span class="clinica-bullet">${ico}</span>
      <span>${item}</span>
    </div>
  `).join("") || `<div class="clinica-item" style="color:var(--text-3);">Sin datos en este apartado.</div>`;
}

// ============================================================
//  UTILIDADES
// ============================================================
function calcConcentracion(pres) {
  if (pres.concMgMl !== undefined)
    return { valor: pres.concMgMl, texto: `${formatNum(pres.concMgMl, 3)} mg/ml` };
  if (pres.concUgMl !== undefined)
    return { valor: pres.concUgMl, texto: `${formatNum(pres.concUgMl, 2)} mcg/ml` };
  return { valor: 0, texto: "—" };
}
function tiempoRestante(volMl, mlH) {
  if (!mlH || mlH <= 0) return "—";
  const horas = volMl / mlH;
  if (horas >= 24) return `${(horas / 24).toFixed(1)} días`;
  if (horas >= 1)  return `${Math.floor(horas)}h ${Math.round((horas % 1) * 60)}min`;
  return `${Math.round(horas * 60)} min`;
}
function formatNum(n, decimals = 2) {
  if (n === null || isNaN(n)) return "—";
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: decimals, minimumFractionDigits: 0 }).format(n);
}
// ── Slider de seguridad ───────────────────────────────────
function onSafetySliderInput(slider) {
  const val      = parseFloat(slider.value);
  const step     = parseFloat(slider.step);
  const decimals = step < 0.05 ? 2 : step < 1 ? 1 : 0;
  const rounded  = parseFloat(val.toFixed(decimals));
  document.getElementById("valor-input").value = String(rounded).replace(".", ",");
}
function onSafetySlider(slider) {
  const val      = parseFloat(slider.value);
  const step     = parseFloat(slider.step);
  const decimals = step < 0.05 ? 2 : step < 1 ? 1 : 0;
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
    .then(() => mostrarToast("Copiado: " + texto, "ok"))
    .catch(() => mostrarToast("No se pudo copiar", "error"));
}
function mostrarToast(mensaje, tipo) {
  const c = document.getElementById("toast-container");
  if (!c) return;
  const t = document.createElement("div");
  t.className = "toast" + (tipo === "ok" ? " toast--ok" : "");
  t.textContent = mensaje;
  c.appendChild(t);
  setTimeout(() => t.remove(), 2100);
}
