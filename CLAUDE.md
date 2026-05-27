# CLAUDE.md — DosisPed

Guía de referencia para el desarrollo asistido por IA de este proyecto.
**Léelo completo antes de proponer cualquier cambio.**

---

## 1. Descripción del proyecto

**DosisPed** es una calculadora clínica de dosis y perfusiones pediátricas, hermana del proyecto **Perfusiones UCI** (carpeta `Perfusiones/` adyacente, del cual hereda arquitectura y patrones). Está diseñada para uso a pie de cama en cuatro escenarios:

- **Urgencias pediátricas** — dosis intermitentes orales/IV/IM/rectal/nebulizadas
- **Planta de hospitalización** — pautas habituales en niños ingresados
- **Consulta Externa de Pediatria** — pautas habituales en niños vistos en consulta hospitalaria de Pediatría
- **UCI pediátrica (UCIP)** — perfusiones continuas, cargas, vasoactivos, sedoanalgesia
- **Neonatología** — dosificación por edad gestacional + edad postnatal, fórmulas magistrales

### Contexto clínico relevante

- Pediatría = **dosificación por peso + edad** (a veces ambos). Algunos fármacos cambian la pauta según edad (paracetamol IV en < 10 kg, ondansetrón por franjas de peso, etc.).
- **Neonatología** tiene reglas propias: dosis y frecuencia varían por edad gestacional (EG) y edad postnatal (EPN). Cafeína, gentamicina, vancomicina y muchos antibióticos siguen tablas de Neofax/SEN.
- Existen **topes de dosis adulto** (`dosis_max_mg`, `dosis_max_dia_mg`) que no deben superarse aunque el peso × dosis/kg lo indique. Esto es crítico: un niño de 60 kg no puede recibir 60 × 15 mg/kg = 900 mg de paracetamol; el tope es 1000 mg pero la diaria es 4000.
- **Preparados comerciales españoles** con concentración específica determinan el volumen del jarabe. Apiretal 100 mg/mL no es igual que un jarabe genérico de 24 mg/mL: el cálculo de ml por toma es lo que prescribe el clínico realmente.
- **Fórmulas magistrales hospitalarias** (preparadas en farmacia del hospital del usuario): existen y son importantes. Ejemplos actuales:
  - Metilprednisolona jarabe **1 mg/mL**
  - Ondansetrón jarabe **0,8 mg/mL**
  - Sacarosa **24%** (preparada con 11 mL sacarosa 64% + 19 mL agua destilada → 30 mL totales)
  - Furosemida susp. **1 mg/mL**
  - Omeprazol susp. **2 mg/mL**
- La herramienta es **apoyo clínico, no decisión clínica**. El profesional supervisa siempre. Modal de bienvenida obligatorio y disclaimer en el "Acerca de" hacen explícito este principio.

### Jerarquía de fuentes (decisión del usuario)

En orden de prioridad, ante discrepancia entre fuentes:

1. **Pediamécum** (Comité de Medicamentos de la AEP) — referencia maestra
2. **SEUP** (Sociedad Española de Urgencias Pediátricas) — prioritaria en urgencias
3. **Neofax / SEN** — neonatología
4. **Ficha técnica AEMPS** + **Harriet Lane** — complemento

Cada fármaco lleva campo `fuente:` con la(s) referencia(s) usada(s).

---

## 2. Arquitectura

### Estructura de archivos

```
DosisPed/
├── index.html          → Estructura HTML + modales bienvenida/fuentes
├── styles.css          → CSS completo con tokens, modo claro/oscuro, responsive
├── app.js              → Lógica: estado, render, cálculos, modales, paciente
├── farmacos.js         → Base de datos de fármacos (datos puros, sin lógica)
├── manifest.json       → Manifest PWA
├── sw.js               → Service Worker (network-first)
├── icon-{180,192,512}.svg → Iconos PWA
└── CLAUDE.md           → Este archivo
```

Convivimos con la carpeta hermana `Perfusiones/` (NO editar — proyecto independiente). Solo se consulta como referencia.

### Relaciones entre archivos

```
index.html
  ├── <link> styles.css           (cargado en <head>)
  ├── <script> farmacos.js        (cargado antes de app.js)
  └── <script> app.js             (accede a `farmacos`, `categorias`, `ISO` globales)
```

`farmacos.js` expone tres variables globales:
- `farmacos` → array de objetos fármaco
- `categorias` → array de strings con categorías únicas ordenadas alfabéticamente
- `ISO` → mapa de colores categoría → token CSS

`app.js` consume las tres. No hay módulos ES, ni imports, ni bundler. Todo es global.

### Estructura del DOM

```
<body>
  <header class="app-header">          ← fijo, z-index 100, incluye paciente+edad
  <div id="neonato-panel">             ← desplegable bajo header en modo neonato
  <div class="app-content">            ← grid 2 columnas (sidebar + main)
    <aside class="sidebar">            ← lista, búsqueda, filtros
    <main class="main-area">
      <div class="empty-state">        ← visible sin fármaco seleccionado
  <aside id="panel-detalle">           ← panel de fármaco (slide en desktop / móvil)
  <div id="panel-overlay">             ← overlay móvil
  <div id="modal-bienvenida">          ← modal inicial (primer arranque)
  <div id="modal-fuentes">             ← modal "Acerca de"
  <div id="toast-container">           ← toasts (copia, errores)
```

### Estado global (app.js)

| Variable | Tipo | Descripción |
|---|---|---|
| `pesoActual` | `number \| null` | Peso del paciente en kg |
| `edadValor` | `number \| null` | Valor numérico de edad |
| `edadUnidad` | `"anios" \| "meses" \| "dias"` | Unidad de edad |
| `modoNeonato` | `boolean` | Si el modo neonato está activo |
| `egSemanas` | `number \| null` | Edad gestacional (semanas) |
| `epnDias` | `number \| null` | Edad postnatal (días) |
| `farmSeleccionado` | `object \| null` | Objeto fármaco completo |
| `presIndex` | `number` | Índice de presentación de perfusión activa |
| `intIndex` | `number` | Índice de pauta intermitente activa |
| `prepIndex` | `number` | Índice de preparado comercial activo |
| `modoCalculo` | `"dosis" \| "ml"` | Dirección del cálculo en perfusión |
| `modoAdmin` | `"intermitente" \| "perfusion" \| "carga_mantenimiento" \| "puntual"` | Modo de administración |
| `categoriaFiltro` | `string` | Categoría activa o `"Todos"` o `"Favoritos"` |
| `clinicaTab` | `"indicaciones" \| "precauciones" \| "contraindicaciones"` | Tab clínica activa |
| `clinicaAbierta` | `boolean` | Si la sección clínica está abierta |
| `favoritos` | `Set<string>` | Nombres de fármacos favoritos |

Todo el estado relevante se persiste en `localStorage` con claves `dosisped-*`.

### Persistencia (localStorage)

| Clave | Valor |
|---|---|
| `dosisped-tema` | `"claro"` \| `"oscuro"` |
| `dosisped-peso` | número (kg) |
| `dosisped-edad` | número |
| `dosisped-edad-unidad` | `"anios"` \| `"meses"` \| `"dias"` |
| `dosisped-neonato` | `"true"` \| `"false"` |
| `dosisped-eg` | número (semanas) |
| `dosisped-epn` | número (días) |
| `dosisped-favoritos` | `JSON.stringify([...nombres])` |
| `dosisped-bienvenida-vista` | `"1"` (si el usuario marcó no repetir) |
| `dosisped-ultimo-farmaco` | `string` (nombre del fármaco abierto — persistencia entre recargas) |
| `dosisped-paciente-rx` | `JSON.stringify([{nombre, modoAdmin, intIndex, presIndex, prepIndex, factor, pesoSnapshot, edadSnapshot, ts}, ...])` — prescripción del paciente actual |

**sessionStorage** (solo durante la sesión del navegador):

| Clave | Valor |
|---|---|
| `dosisped-historial` | `JSON.stringify([{nombre, categoria, icono, ts}, ...])` — últimos 15 fármacos abiertos |

### Flujo de datos

```
Usuario selecciona fármaco
  → seleccionarFarmaco(f)
    → farmSeleccionado = f, índices = 0, modoAdmin = primer modo del fármaco
    → abrirPanel()         ← añade 'con-panel' a .app-content, overlay solo en móvil
    → renderPanel()        ← reset completo de UI del panel
      → renderAdminModos() ← solo si > 1 modo
      → renderTabsSegunModo() ← pautas intermitentes o presentaciones de perfusión
      → render del modo activo: renderModoIntermitente / Perfusion / CargaMant / Puntual
      → renderInfoClinica()

Usuario cambia peso/edad
  → onPacienteCambio()
    → si farmSeleccionado: renderPanel() — todo se recalcula

Usuario cambia preparado comercial (modo intermitente)
  → seleccionarPreparado(i)
    → prepIndex = i
    → renderPanel()
```

---

## 3. Modelo de datos: objeto fármaco

```js
{
  nombre: "NOMBRE EN MAYÚSCULAS",         // string, se muestra tal cual
  categoria: "Categoría",                   // debe coincidir con otras del mismo grupo
  sinonimos: ["marca", "alias"],            // array de strings para búsqueda fuzzy
  isoColor: ISO.categoria,                  // referencia a constante ISO
  icono: "emoji",                           // un emoji
  vias: ["oral", "iv", "im", "io", "rectal", "neb", "sc", "sl"],  // primera = preferida
  modos: ["intermitente", "perfusion", "carga_mantenimiento", "puntual"],
  fuente: "Pediamécum / SEUP",              // referencia citada al pie de info clínica

  // ── MODO INTERMITENTE (la mayoría de fármacos pediátricos) ──
  intermitente: [
    {
      indicacion: "Texto corto",            // título de la pauta (se usa en tabs si > 1)
      via: "oral",                          // vía de esta pauta concreta

      // Una (y solo una) de estas formas de expresar la dosis:
      dosis_mg_kg: 15,                      // mg/kg por toma
      dosis_mcg_kg: 0.15,                   // mcg/kg por toma (se convierte a mg internamente)
      dosis_mg_kg_dia: 50,                  // mg/kg/día total (se divide entre las tomas)
      dosis_fija_mg: 4,                     // dosis fija independiente de peso

      intervalo_h: 6,                        // cada N horas (para calcular nº tomas/día)
      dosis_max_mg: 1000,                    // tope absoluto por toma (adulto)
      dosis_max_dia_mg: 4000,                // tope absoluto por día
      duracion: "5-7 días",                  // texto descriptivo de la duración

      preparados: [                          // preparados comerciales españoles
        { nombre: "Apiretal 100 mg/ml gotas", conc_mg_ml: 100 },
        { nombre: "Dalsy 20 mg/ml susp.", conc_mg_ml: 20 }
        // conc_mg_ml: null si es comprimido o cápsula (no calculamos volumen)
      ],

      nota: "Detalles relevantes, ajustes, equivalencias..."
    }
    // Puede haber varias pautas (paracetamol oral/rectal/IV son tres pautas distintas)
  ],

  // ── MODO PERFUSIÓN CONTINUA (UCIP) ──
  presentaciones: [                          // (mismo esquema que Perfusiones UCI)
    {
      label: "10 mg / 250 ml Dx5%",          // descripción de la dilución
      dosis_mg: 10,                          // mg totales en la bolsa
      dilucion_ml: 250,                      // volumen total
      suero: "Dx5%" | "SSF" | "Puro",
      concUgMl: (10 * 1000) / 250,           // mcg/ml — calcular INLINE (auditable)
      concMgMl: 10 / 250,                    // mg/ml — usar UNO de los dos según unidad
      dosisRange: "0,05 – 2 mcg/kg/min",     // string mostrado al usuario
      dosisMin: 0.05,                         // mínimo numérico (alerta "baja")
      softMax: 2,                             // máximo habitual (alerta "alta")
      hardMax: 3,                             // máximo de seguridad (alerta "tóxica")
      unidad: "mcg/kg/min",                   // unidad que ve el usuario en el input
      calcTipo: "mcg_kg_min"                  // determina la fórmula (ver tabla §4)
    }
  ],

  // ── MODO CARGA + MANTENIMIENTO ──
  carga: {                                    // (igual estructura que Perfusiones)
    descripcion: "Texto descriptivo",
    dosis_mg_kg: 20,                          // o dosis_mcg_kg
    tiempo_min: 20,                           // duración de la infusión
    via: "IV en 20 min, diluido en SSF",
    nota: "Detalles, dosis máxima, alternativas..."
  },

  // ── MODO PUNTUAL (rescate, parada, anafilaxia...) ──
  puntual: {
    descripcion: "Texto descriptivo",
    dosis_mg_kg: 0.01,                        // o dosis_mcg_kg o dosis_fija_mg
    dosis_max_mg: 1,                          // tope adulto (opcional)
    via: "IV/IO/IM en bolo",
    nota: "Repetir cada X min, etc."
  },

  // ── INFORMACIÓN CLÍNICA (siempre) ──
  info: {
    indicaciones:       [ "...", "..." ],
    contraindicaciones: [ "...", "..." ],
    precauciones:       [ "...", "..." ]
  }
}
```

### Reglas de oro al añadir/editar un fármaco

1. **Inserta en orden alfabético** por `nombre`. Los bloques se separan con `// ── A ──`, `// ── B ──`, etc.
2. **Calcula concentraciones inline** como expresión matemática comentada: `concUgMl: (10 * 1000) / 250  // 40 mcg/ml`. NO pongas el número fijo — la expresión es auditable clínicamente.
3. **`dosis_max_mg` y `dosis_max_dia_mg`** son críticos. Inclúyelos siempre que existan topes adulto (paracetamol 1000/4000, amoxi 1000/3000, etc.). La UI aplica el tope automáticamente y muestra alerta.
4. **`preparados` debe reflejar la realidad española**: nombres comerciales reales (Apiretal, Dalsy, Augmentine, Estilsona, Ventolin...) con `conc_mg_ml` correcto. Si es comprimido/cápsula, `conc_mg_ml: null`.
5. **Fórmulas magistrales hospitalarias**: incluir como preparado con sufijo "— fórmula magistral hospital" o "— hospital" (ej. metilprednisolona 1 mg/mL, ondansetrón 0,8 mg/mL).
6. **Categorías existentes** (no inventar nuevas sin razón):
   - Analgesia / Antitérmico
   - Antibiótico
   - Antiepiléptico / Sedante
   - Antiemético
   - Antihistamínico
   - Antivírico
   - Cardiología
   - Corticoide
   - Digestivo
   - Diurético
   - Endocrino
   - Hematología
   - Neonatos
   - Reanimación / UCIP
   - Respiratorio
7. **`sinonimos`** sirve para búsqueda fuzzy: incluye marcas comerciales (`"nolotil"`, `"metalgial"`), aliases (`"epinefrina"`) y errores frecuentes (`"fenitoina"` sin tilde).
8. **`fuente`** debe ser conciso: `"Pediamécum (AEP)"`, `"SEUP / Pediamécum"`, `"Neofax / SEN"`, etc.

---

## 4. Tabla de calcTipo (modo perfusión)

| `calcTipo` | Necesita peso | Unidad dosis | Fórmula ml/h |
|---|---|---|---|
| `"mcg_kg_min"` | Sí | mcg/kg/min | `(dosis × peso × 60) / concUgMl` |
| `"mcg_kg_h"` | Sí | mcg/kg/h | `(dosis × peso) / concUgMl` |
| `"mg_kg_h"` | Sí | mg/kg/h | `(dosis × peso) / concMgMl` |
| `"mcg_min"` | No | mcg/min | `(dosis × 60) / concUgMl` |
| `"mcg_h"` | No | mcg/h | `dosis / concUgMl` |
| `"mg_h"` | No | mg/h | `dosis / concMgMl` |
| `"mg_min"` | No | mg/min | `(dosis × 60) / concMgMl` |

Implementadas en `calcMlH()` y `calcDosis()` en `app.js`. **No añadir nuevos `calcTipo` sin añadir el caso en ambas funciones.**

---

## 5. Sistema de variables CSS

### Organización

```css
:root { }            /* Modo oscuro (por defecto) */
:root.modo-claro { } /* Overrides para modo claro */
```

La clase `modo-claro` se añade a `<html>` desde JS. Se persiste en `localStorage` con clave `dosisped-tema`.

### Tokens principales

| Variable | Uso |
|---|---|
| `--bg`, `--bg-2`, `--bg-3`, `--bg-4` | Fondos en capas (base → microelementos) |
| `--border`, `--border-lite` | Bordes principal / secundario |
| `--cyan`, `--cyan-dim`, `--cyan-glow` | Color de marca (turquesa pediátrico) |
| `--pink`, `--pink-dim` | Acento secundario (analgesia, gradiente del logo) |
| `--green`, `--green-dim` | OK / en rango / indicaciones |
| `--amber`, `--amber-dim` | Alertas suaves / precauciones |
| `--red`, `--red-dim` | Errores / dosis tóxica / contraindicaciones |
| `--text-1`, `--text-2`, `--text-3` | Texto principal / secundario / terciario |
| `--iso-{analgesia,antibiotico,respiratorio,neuro,cardio,digestivo,endocrino,neonatal,rea,neutral}` | Colores ISO por categoría (tira lateral de las tarjetas) |
| `--radius` (10px), `--radius-lg` (16px), `--radius-xl` (20px) | Bordes redondeados |
| `--font` (Inter), `--mono` (JetBrains Mono) | Fuentes |
| `--header-h` (62/54px), `--panel-w` (440/380/100%) | Geometría responsive |
| `--safe-zone`, `--soft-stop`, `--hard-stop` | Gradiente del slider de seguridad |

### Naming CSS

- **Componentes**: `.nombre-componente` (kebab-case en español)
- **Modificadores BEM**: `.componente--modificador` (doble guion)
- **Prefijos semánticos**:
  - `.farm-*` → tarjetas de fármaco en la lista
  - `.panel-*` → panel de detalle
  - `.dosis-int-*` → caja de dosis intermitente
  - `.dosis-especial-*` → cajas de carga y puntual
  - `.res-*` → resultado de perfusión
  - `.calc-*` → calculadora
  - `.paciente-*` → widget de paciente (peso/edad)
  - `.neonato-*` → panel de modo neonato
  - `.modal-*` → modales
  - `.clinica-*` → información clínica
  - `.chip`, `.tab-pres`, `.btn-*` → primitivos

### Breakpoints

| Media query | Contexto |
|---|---|
| `> 900px` | Desktop: sidebar 320px, panel ancho |
| `≤ 900px` y `> 640px` | Tablet: sidebar 250px, panel más estrecho, paciente compacto |
| `≤ 640px` | Móvil: layout vertical, panel slide desde abajo, paciente baja al panel |
| `≤ 360px` | Móvil muy pequeño: ajustes de grid |

---

## 6. Naming JS

- Funciones y variables: `camelCase` en español (`seleccionarFarmaco`, `renderModoIntermitente`)
- Constantes globales: `UPPER_SNAKE` en español (`KEY_PESO`, `KEY_FAV`)
- Estado global: declarado al inicio de `app.js` con `let`
- IDs del DOM: se acceden siempre con `getElementById`, NUNCA se cachean en variables globales

---

## 7. Lógica de cálculo en modo intermitente

`calcularDosisIntermitente(pauta)` devuelve `{ dosis, dosisDia, dosisDiaFinal, calcTexto, tomasDia }`:

- `tomasDia` = `Math.round(24 / pauta.intervalo_h)`
- Si `dosis_mg_kg`: `dosis = mg_kg × peso`, `dosisDia = dosis × tomasDia`
- Si `dosis_mcg_kg`: convertir a mg (`/ 1000`), después igual
- Si `dosis_mg_kg_dia`: `dosisDia = mg_kg_dia × peso`, `dosis = dosisDia / tomasDia`
- Si `dosis_fija_mg`: `dosis = mg_fija`, `dosisDia = dosis × tomasDia`

Después de calcular:
- Si `dosis > dosis_max_mg` → aplicar tope y mostrar alerta naranja "Dosis máxima por toma"
- Si `dosisDia > dosis_max_dia_mg` → aplicar tope y mostrar alerta "Dosis diaria máxima"

El **volumen** del preparado se calcula como `dosisFinal / preparado.conc_mg_ml` y se muestra en una lista interactiva (clic = preparado activo).

---

## 8. Modales

- **`modal-bienvenida`** se muestra automáticamente al primer arranque (mientras no exista `dosisped-bienvenida-vista` en localStorage). Incluye disclaimer obligatorio, uso racional y referencia a fuentes. Checkbox "No mostrar al iniciar" persiste la decisión.
- **`modal-fuentes`** se abre desde el botón ⓘ del header. Es el "Acerca de" con:
  - Descripción del proyecto
  - Lista completa de fuentes con URLs (Pediamécum, SEUP, Neofax, AEMPS, Harriet Lane, Lexicomp)
  - Aviso legal y limitación de responsabilidad completos
  - Uso racional del medicamento (5 puntos)
  - Metadata: versión y fecha

Ambos comparten estilos `.modal-*` con animación `modalIn` y son responsive (bottom-sheet en móvil).

---

## 9. Sliders (perfusión y ajuste fino)

### 9.1 Slider de seguridad (modo perfusión)

Aparece al calcular resultado en modo perfusión. Componentes:

- Gradiente CSS dinámico verde→ámbar→rojo basado en `dosisMin`, `softMax`, `hardMax`
- Rango máximo del slider: `hardMax × 1.2` (o `softMax × 1.5` si no hay hardMax)
- Etiqueta dinámica: "✓ En rango / ▲ Alto / ▼ Bajo / ⚠ Tóxico"
- `oninput` → actualiza el input numérico en tiempo real (sin recalcular)
- `onchange` (soltar) → fuerza `modoCalculo = "dosis"` y llama a `calcular()`

Implementado en `mostrarResultado()` con funciones globales `onSafetySliderInput()` y `onSafetySlider()`.

### 9.2 Slider de ajuste fino (modo intermitente)

Aparece bajo el resultado en modo intermitente cuando la dosis se calcula por peso (mg/kg, mcg/kg o mg/kg/día). Permite multiplicar la dosis calculada por un factor 0,5× – 1,5× sin alterar la pauta base.

- Variable de estado: `factorInt` (1.0 por defecto)
- Se resetea a 1.0 al cambiar de fármaco o de pauta (controlado por `window._lastIntKey`)
- `oninput` (arrastre): NO llama a `renderPanel()` — re-renderizar destruiría el slider y mataría el arrastre. En su lugar actualiza directamente vía DOM: dosis por toma, total día, volúmenes de preparados, header del slider
- `onchange` (al soltar): `renderPanel()` completo para re-sincronizar el resto de la UI
- Topes (`dosis_max_mg`) se aplican después del factor: el tope sigue siendo absoluto
- Visualmente: gradiente cyan-verde-ámbar en el track marcando "menos / estándar / más"; etiqueta con porcentaje en color del rango activo

Implementado en `renderIntermitenteBox()` (HTML del slider y multiplicación de `dosisFinal`/`dosisDiaConFactor`) y funciones globales `onAjusteFinoInput()` / `onAjusteFino()`.

---

## 9bis. Historial de sesión

Botón ⏱ en el header abre un dropdown con los últimos 15 fármacos abiertos en la sesión actual (sessionStorage, se borra al cerrar pestaña).

- Se registra automáticamente al llamar a `seleccionarFarmaco(f)` mediante `registrarHistorial(f)`
- Cada entrada guarda `{nombre, categoria, icono, ts}` con timestamp
- Si el fármaco ya está en el historial, se mueve al inicio (no se duplica)
- Cada entrada muestra "ahora / hace N min / hace N h"
- Botón "Vaciar" limpia el historial
- Clic fuera del dropdown lo cierra (event listener global con `stopPropagation` en el botón)
- Clic en entrada abre el fármaco directamente con `abrirDesdeHistorial()`

---

## 9quater. Vista paciente (prescripción multi-fármaco)

Botón 👤 en el header con badge numérico (cantidad de fármacos prescritos). Abre un modal con la prescripción consolidada del paciente actual.

**Añadir un fármaco**: botón `+` en la cabecera del panel de detalle (`#btn-add-paciente`). Al pulsarlo guarda un snapshot que incluye:
- `nombre`, `modoAdmin`, `intIndex`, `presIndex`, `prepIndex`, `factor`
- `pesoSnapshot`: peso del paciente en el momento de añadir (para detectar staleness)
- `edadSnapshot`: edad como string (`"8 meses"`, etc.)
- `ts`: timestamp

Si el fármaco ya está en la Rx con la misma combinación de modo/pauta/presentación, se actualiza (no se duplica). El botón cambia de color cuando el fármaco actual ya está en la Rx (`btn-add-paciente--guardado`).

**Render del modal**:
- Cabecera con datos del paciente (peso, edad, EG/EPN si neonato)
- Tarjeta por fármaco con tira lateral de color ISO de categoría
- Cada tarjeta muestra dosis recalculada con peso/edad actuales (no el snapshot) llamando a `calcularResumenRx(f, item)`
- Si `pesoSnapshot ≠ pesoActual` → tarjeta marcada como **stale** (borde ámbar + aviso "Re-añade el fármaco para actualizar")
- Helpers de cálculo independientes del estado global: `calcularDosisIntermitenteRx(pauta, peso)` y `calcularDosisEspecialPeso(d, peso)` — pasan el peso explícito en lugar de usar `pesoActual`

**Acciones**:
- **Quitar** un fármaco: botón ✕ en la tarjeta → `quitarDePaciente(i)`
- **Copiar Rx** (📋): genera texto plano formateado con todos los datos + advertencia legal, lo copia al portapapeles
- **Vaciar Rx**: borra todas las prescripciones, mantiene peso/edad
- **Nuevo paciente**: borra peso, edad, modo neonato, EG, EPN y la prescripción. Limpia inputs del DOM.

**Estado**: persiste en `localStorage` (`dosisped-paciente-rx`). Sobrevive a recargas. Se limpia con "Nuevo paciente".

---

## 9ter. Persistencia del fármaco abierto

Al seleccionar un fármaco se guarda su nombre en `localStorage` (`dosisped-ultimo-farmaco`). Al cerrar el panel (✕) se elimina. Al cargar la app, si existe la clave, se abre automáticamente el fármaco.

Útil para recargas accidentales / actualizaciones del Service Worker en pleno turno.

---

## 10. PWA

- `manifest.json` declara nombre, colores tema, iconos SVG (180/192/512), categorías médicas.
- `sw.js` con estrategia **network-first** + fallback caché. Versión en constante `CACHE_NAME = "dosisped-v1"` — **incrementar al hacer cambios significativos** (`dosisped-v2`, etc.) para forzar invalidación.
- Iconos SVG en gradiente turquesa→coral con la silueta del corazón pediátrico y la cruz.
- `app.js` registra el SW y recarga automáticamente al recibir nuevo controlador (`controllerchange`).

---

## 11. Instrucciones para Claude

### Principios generales

1. **Seguridad clínica antes que estética.** Los resultados numéricos (mg/toma, ml/h, ml de jarabe) deben ser siempre los elementos más prominentes. Las alertas son informativas, no bloqueantes.
2. **No añadir lo que no se pide.** Si el usuario pide cambiar la dosis de un fármaco, no refactorices el sistema de cálculo. Si pide un fármaco nuevo, no añadas una nueva categoría visual sin consultar.
3. **Lee antes de editar.** Siempre. Especialmente en `farmacos.js` que es largo y tiene patrones repetidos.
4. **Fuentes verificables.** Al añadir un fármaco, declara siempre la `fuente`. En caso de duda entre fuentes, aplica la jerarquía: Pediamécum → SEUP (urgencias) → Neofax (neonatos) → AEMPS / Harriet Lane.

### Qué preservar siempre

- **Separación de capas**: datos clínicos en `farmacos.js`, lógica en `app.js`, presentación en `styles.css`. No mezclar.
- **Sin frameworks ni dependencias**: HTML/CSS/JS puro. Nada de React, Vue, npm, bundlers, ES modules.
- **Sistema de tokens CSS**: no hardcodear colores ni tamaños. Si necesitas uno nuevo, añade variable en `:root`.
- **Soporte claro/oscuro**: todo elemento visual nuevo debe verse bien en ambos modos. Añadir overrides en `:root.modo-claro` si es necesario.
- **Responsive en los tres breakpoints**: desktop / tablet / móvil.
- **Decimal con coma (es-ES)**: `formatNum()` y el reemplazo `","→"."` en los `parseFloat`. No cambiar a `.toLocaleString()` sin asegurarse del locale.
- **Topes de dosis adulto**: NUNCA quitar `dosis_max_mg` o `dosis_max_dia_mg` sin razón documentada. Es una salvaguarda crítica en pediatría.

### Qué no tocar sin permiso explícito

- Fórmulas en `calcMlH()`, `calcDosis()`, `calcularDosisIntermitente()`, `calcularDosisEspecial()`. Son validadas clínicamente.
- Valores numéricos en fármacos (`dosis_mg_kg`, `dosis_max_mg`, `concUgMl`, etc.). Requieren validación clínica.
- Texto del modal de bienvenida y el aviso legal del "Acerca de". Tiene relevancia médico-legal.
- La jerarquía de fuentes citada en el "Acerca de" y en `MEMORY.md`.
- El comportamiento del botón ✕ (`cerrarPanel`): siempre limpia `farmSeleccionado` y restaura el estado vacío.

### Al añadir un nuevo fármaco

Checklist obligatorio:

- [ ] Insertar en **orden alfabético** por `nombre`
- [ ] `categoria` coincide con una existente (no inventar nuevas sin razón)
- [ ] `isoColor: ISO.categoria` definido
- [ ] `vias` con al menos una vía, en orden de preferencia clínica
- [ ] `modos` con los modos relevantes (intermitente, perfusion, carga_mantenimiento, puntual)
- [ ] `fuente` declarada
- [ ] Para cada pauta intermitente: `via`, dosis (mg/kg o mg/kg/día o mcg/kg o fija), `intervalo_h`, `dosis_max_mg` si aplica, `dosis_max_dia_mg` si aplica, `preparados` con concentraciones reales
- [ ] Para perfusión: `concUgMl` o `concMgMl` como expresión inline, `calcTipo` correcto, rango `dosisMin`/`softMax`/`hardMax`
- [ ] `info: { indicaciones, contraindicaciones, precauciones }` siempre — mínimo 2-3 ítems en cada uno
- [ ] Verificar dosis contra Pediamécum/SEUP/Neofax antes de commit

### Al modificar CSS

- No usar `!important` salvo casos ya existentes y justificados
- Reglas base (desktop) sin media query; tablet `@media (max-width: 900px)`; móvil `@media (max-width: 640px)`
- El panel (`#panel-detalle`) tiene comportamiento diferente desktop (`position: fixed` translateX) y móvil (translateY desde abajo). Respetar ambos.

### Al modificar app.js

- `renderPanel()` siempre debe funcionar como **reset completo** del panel para el fármaco/modo actuales. No asumir estado previo: ocultar todas las secciones primero, mostrar las relevantes después.
- No cachear referencias DOM en variables globales. Acceder con `getElementById` en el momento de uso.
- `abrirPanel()` añade `.con-panel` a `.app-content` y activa overlay solo si `window.innerWidth <= 640`.
- `cerrarPanel()` limpia: `.con-panel`, `.abierto`, `farmSeleccionado = null`, y re-renderiza la lista.

### Versionado del Service Worker

Si se hacen cambios funcionales relevantes (nuevos fármacos no cuentan; cambios en `app.js` o `styles.css` sí), incrementar `CACHE_NAME` en `sw.js` para forzar invalidación del caché del usuario.

---

## 12. Decisiones de diseño documentadas

**¿Por qué cuatro modos de administración?**
Porque la pediatría usa los cuatro flujos:
- Intermitente: 80% de los casos (oral, IV intermitente, IM, rectal, neb)
- Perfusión: UCIP y neonatología (vasoactivos, sedoanalgesia)
- Carga + mantenimiento: amiodarona, fenitoína, levetiracetam, cafeína…
- Puntual: rescate (adenosina, atropina, naloxona, sacarosa 24%, vitamina K)

**¿Por qué `dosis_mg_kg` o `dosis_mg_kg_dia` como alternativos?**
Pediamécum mezcla los dos formatos según el fármaco. Algunos prescriben por toma (paracetamol 15 mg/kg/dosis), otros por día (amoxicilina 80 mg/kg/día). Forzar una sola unidad introduciría errores de cálculo manual.

**¿Por qué los preparados están en cada pauta y no en el fármaco?**
Porque la vía determina el preparado. Paracetamol oral, rectal e IV son tres presentaciones farmacológicas distintas (Apiretal, supositorios, Perfalgan). Mantenerlos por pauta evita confusiones.

**¿Por qué peso + edad + modo neonato y no solo peso?**
La edad gestacional y postnatal modifican las dosis neonatales (cafeína: pauta por EG). La edad también modifica algunas reglas no-neonatales (paracetamol IV < 10 kg, ondansetrón por franjas, edad mínima de ibuprofeno ≥ 3 meses).

**¿Por qué un slider de seguridad solo en perfusión?**
En perfusión el usuario introduce la dosis manualmente y la titula; el slider con gradiente le ayuda a visualizar el rango seguro y experimentar. En intermitente la dosis se calcula a partir del peso; no hay "ajuste libre".

**¿Por qué fórmulas magistrales destacadas?**
El usuario trabaja en un hospital concreto con fórmulas magistrales específicas (metilprednisolona 1 mg/mL, ondansetrón 0,8 mg/mL, sacarosa 24%). Esas son las concentraciones que realmente verá el clínico; el sufijo "— hospital" o "— fórmula magistral hospital" las identifica.

---

## 12bis. Despliegue automatizado (GitHub Pages)

El proyecto está publicado en **https://cjgaland.github.io/DosisPed/** desde el repositorio **github.com/cjgaland/DosisPed** (rama `main`).

El working directory local (`/Users/Trabajo/Desktop/Pediatría/DosisPed/`) está conectado al remoto `origin` (`https://github.com/cjgaland/DosisPed.git`).

### Comando "despliega"

Cuando el usuario diga **"despliega"**, **"sube los cambios"**, **"actualiza el repo"**, **"publica"** o equivalente, Claude debe ejecutar el siguiente flujo:

1. **Comprobar estado**:
   ```bash
   git status --short
   git diff --stat
   ```
   Mostrar al usuario lo que va a subir.

2. **Bumpear el Service Worker** si han cambiado `app.js`, `farmacos.js`, `styles.css`, `index.html` o `sw.js`. Incrementar `CACHE_NAME` en `sw.js` (de `dosisped-vN` a `dosisped-v(N+1)`) — esto es lo que hace que los usuarios vean el banner **"Nueva versión disponible"** en su próxima apertura y puedan actualizar con un toque sin vaciar la caché manualmente.

3. **Validar sintaxis**:
   ```bash
   node -c app.js && node -c farmacos.js
   ```
   Abortar si hay errores.

4. **Stage selectivo** (importante: NO tocar `Perfusiones/`):
   ```bash
   git add app.js farmacos.js styles.css index.html sw.js manifest.json README.md CLAUDE.md DESPLIEGUE.md .gitignore icon-*.svg
   ```
   Si hay archivos nuevos relevantes, añadirlos también. NO usar `git add -A` (podría arrastrar archivos no deseados o modificaciones de Perfusiones).

5. **Commit** con mensaje descriptivo (resumir los cambios reales del turno):
   ```bash
   git commit -m "Mensaje descriptivo de los cambios"
   ```
   El mensaje debe ser breve (1 línea ≤ 72 chars). NO incluir co-autor de Claude a menos que el usuario lo pida.

6. **Push**:
   ```bash
   git push origin main
   ```

7. **Confirmar al usuario**: indicar que se ha desplegado. GitHub Pages tarda 30-60 s en propagar. Los usuarios que tengan la PWA instalada verán automáticamente el banner **"Nueva versión disponible"** con el botón **"Actualizar"** en su próxima apertura — al pulsarlo la app se recarga con la nueva versión sin necesidad de vaciar la caché.

### Reglas estrictas para el despliegue

- **Nunca tocar `Perfusiones/`**: es otro proyecto. Si aparece como modificado en `git status`, ejecutar `git checkout -- Perfusiones/` antes del commit.
- **Nunca hacer `git add -A`** ni `git add .` sin verificar previamente con `git status --short`.
- **Nunca hacer `git push --force`** ni `--force-with-lease` salvo petición explícita.
- **Nunca commitear `.DS_Store`**, archivos del editor, ni `.claude/` (cubierto por `.gitignore`).
- **Siempre bumpear `CACHE_NAME` del SW** si cambia código de la app. Comprobar el número actual con `grep CACHE_NAME sw.js`.
- **Antes de cualquier push**, ejecutar `node -c` en `app.js` y `farmacos.js`. Si fallan, no continuar.
- **Si el repo remoto tiene commits que no están en local** (raro pero posible), hacer `git pull --rebase origin main` primero. Resolver conflictos si los hay.

### Verificación post-despliegue

Tras un push exitoso, indicar al usuario:
- URL del despliegue: https://cjgaland.github.io/DosisPed/
- Tiempo estimado de propagación: 30-60 s
- Si tiene la PWA instalada en móvil: cerrar y reabrir para que el SW recoja la nueva versión

### Si el push falla por autenticación

GitHub puede pedir credenciales en la primera vez. Indicarle al usuario que:
- En macOS suele usar el Keychain — la primera vez puede pedir login del navegador
- Si no funciona: configurar un Personal Access Token en github.com → Settings → Developer settings → Personal access tokens (scope: `repo`)
- Avisar al usuario y dejarle que intervenga; NO intentar configurar credenciales sin permiso.

---

## 13. Estado actual (mayo 2026)

- **91 fármacos** en `farmacos.js`, orden alfabético
- **Lotes ya realizados**:
  - **Lote 1** (35): núcleo de urgencias/planta/UCIP esencial
  - **Lote 2** (24): antibióticos (gentamicina, clinda, meropenem, fosfo, cotrimoxazol), neuro (fenitoína, fenobarbital, valproato), cardio (adenosina, amiodarona, atropina, digoxina, milrinona), neonatos (cafeína, prostaglandina E1, vit K), respiratorio (montelukast), antihistamínicos (cetirizina, dexclorfeniramina), digestivo (lactulosa, polietilenglicol), hematología (enoxaparina), sedación (propofol)
  - **Lote 3** (9 + 2 actualizaciones): carbón activado, esmolol, glucagón, glucosa hipertónica, hidralazina, labetalol, metilprednisolona (jarabe magistral 1 mg/mL), sacarosa 24% (fórmula magistral), terbutalina. Actualizaciones: ondansetrón (protocolo hospital máx 4 mg + jarabe magistral 0,8 mg/mL), metamizol (Metalgial añadido).
  - **Lote 4** (20): ácido fólico, anfotericina B, bicarbonato sódico 1 M, captopril, cloruro/gluconato cálcico, dexmedetomidina, enalapril, famotidina, fluconazol, gluconato cálcico (entrada propia), heparina sódica, hierro oral, melatonina, octreotido, propranolol, ranitidina (entrada histórica con aviso de retirada), rocuronio, succinilcolina, sumatriptán, vitamina D.
  - **Lote 5** (7): amlodipino, bromuro de ipratropio, eritromicina, espironolactona, hidroclorotiazida, indometacina IV (cierre DAP), surfactante pulmonar (poractant alfa).

- **Funcionalidades implementadas**:
  - 4 modos de administración (intermitente, perfusión, carga+mant, puntual)
  - Paciente: peso + edad (años/meses/días) + modo neonato (EG + EPN)
  - Búsqueda por nombre, categoría y sinónimos
  - Filtros por categoría + favoritos
  - Preparados comerciales con cálculo automático de volumen
  - Topes de dosis máxima por toma y por día con alertas
  - Slider de seguridad en perfusión con gradiente de colores
  - Slider de ajuste fino en intermitente (factor 0,5× – 1,5×)
  - Persistencia del fármaco abierto entre recargas
  - Historial de sesión (sessionStorage, últimos 15 fármacos)
  - Vista paciente (prescripción multi-fármaco) con badge contador, copia a portapapeles, "nuevo paciente"
  - Modal de bienvenida obligatorio + "Acerca de" con fuentes
  - PWA offline (manifest + service worker)
  - Modo claro/oscuro con persistencia
  - Responsive desktop / tablet / móvil

---

## 14. Próximos pasos sugeridos (no comprometidos)

**Más fármacos** (lotes futuros):
- Cardio: heparina sódica, propranolol, captopril, enalapril
- Sedación/relajación: dexmedetomidina, rocuronio, succinilcolina
- Antifúngicos: fluconazol IV, anfotericina B
- Digestivo: ranitidina/famotidina
- Neurológicos: sumatriptán
- Suplementos: hierro oral, ácido fólico, vitamina D, melatonina
- Reanimación: bicarbonato 1 M, cloruro/gluconato cálcico, octreotido

**Mejoras de UX**:
- Persistencia del fármaco abierto al recargar
- Historial de cálculos de la sesión (sessionStorage)
- Vista "paciente" con resumen de todos los fármacos calculados
- Modo "comparar preparados" (qué jarabe usar según presentación disponible)
- Exportar prescripción (imprimir / copiar resumen)

**Despliegue**:
- Crear repositorio GitHub
- Configurar GitHub Pages para servir la app
- Decidir dominio personalizado (opcional)
