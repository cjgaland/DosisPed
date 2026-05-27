# Guía de despliegue de DosisPed en GitHub Pages

Esta guía te lleva paso a paso para publicar DosisPed con una URL pública gratuita, accesible desde cualquier dispositivo. Como ya tienes Perfusiones en GitHub, el proceso te resultará familiar.

## ¿Qué es GitHub Pages?

Es un servicio gratuito de GitHub que aloja webs estáticas (HTML/CSS/JS) directamente desde un repositorio. Características:

- **Gratis** y sin límites razonables de tráfico
- **HTTPS** automático (URL segura por defecto)
- **Actualización inmediata**: subes un cambio al repo → la web se actualiza en < 1 minuto
- **PWA compatible**: como DosisPed tiene `manifest.json` y `sw.js`, se puede instalar como app en el móvil
- **Sin servidor que mantener**

---

## Pasos

### 1. Crear el repositorio

1. Entra en [github.com](https://github.com) con tu cuenta
2. Pulsa el botón verde **New** (o **+** → **New repository**)
3. Rellena:
   - **Repository name**: `dosisped`
   - **Description** (opcional): "Calculadora pediátrica de dosis y perfusiones"
   - **Visibility**: **Public** (necesario para GitHub Pages gratis)
   - NO marques "Add a README file" ni "Add .gitignore" — ya están en el proyecto
4. Pulsa **Create repository**

### 2. Subir los archivos

Tienes dos opciones:

#### Opción A — Web (más sencillo)

1. En la página del nuevo repositorio (estará vacía), pulsa **uploading an existing file**
2. Arrastra **todos los archivos** de la carpeta `DosisPed/` a la zona de subida:
   - `index.html`
   - `app.js`
   - `farmacos.js`
   - `styles.css`
   - `manifest.json`
   - `sw.js`
   - `icon-180.svg`, `icon-192.svg`, `icon-512.svg`
   - `README.md`
   - `CLAUDE.md` (opcional, es la guía para Claude)
   - `DESPLIEGUE.md` (este archivo, opcional)
3. Espera a que termine la subida
4. En el campo **Commit changes** escribe: `Versión inicial de DosisPed`
5. Pulsa **Commit changes**

#### Opción B — Terminal (si te manejas con git)

```bash
cd /Users/Trabajo/Desktop/Pediatría/DosisPed
git init
git add .
git commit -m "Versión inicial de DosisPed"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/dosisped.git
git push -u origin main
```

### 3. Activar GitHub Pages

1. En tu repositorio, ve a **Settings** (pestaña superior, a la derecha)
2. En el menú lateral izquierdo, pulsa **Pages**
3. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
4. Pulsa **Save**
5. Recarga la página: arriba aparecerá un mensaje **Your site is live at `https://TU-USUARIO.github.io/dosisped/`**

⏱ Puede tardar 30–60 segundos en estar accesible.

### 4. Probar la URL

Abre `https://TU-USUARIO.github.io/dosisped/` en cualquier navegador. Debería cargarse la app completa.

### 5. Instalar como app en el móvil

**iPhone / iPad (Safari)**:

1. Abre la URL en Safari
2. Toca el botón **Compartir** (cuadrado con flecha hacia arriba)
3. Desplázate y toca **Añadir a pantalla de inicio**
4. Confirma con **Añadir**
5. El icono de DosisPed aparece en la pantalla de inicio como una app

**Android (Chrome)**:

1. Abre la URL en Chrome
2. Aparecerá un banner "Instalar DosisPed" — púlsalo
3. O bien: menú **⋮** → **Instalar app**

Una vez instalada, funciona offline (gracias al Service Worker), ocupa muy poco espacio y se abre en pantalla completa como cualquier app nativa.

### 6. Actualizar la app más adelante

Cada vez que quieras añadir un fármaco o mejorar algo:

1. **Web**: en tu repo de GitHub → entra al archivo → lápiz ✏️ → edita → **Commit changes**
2. **Local + Web**: edita los archivos en tu ordenador → sube a GitHub la versión modificada (Add file → Upload files)

El Service Worker tiene una `CACHE_NAME` versionada (`dosisped-v4`). Si cambias código importante, **incrementa el número** en `sw.js` (a `dosisped-v5`, `v6`…) para que los usuarios reciban automáticamente la nueva versión sin tener que limpiar caché.

---

## Solución de problemas

**La URL devuelve 404**
- Espera 1-2 minutos tras activar Pages
- Verifica que `index.html` está en la raíz del repositorio
- Confirma en Settings → Pages que la rama y carpeta están correctas

**Los cambios no aparecen**
- Cierra y reabre la pestaña del navegador
- Hard reload: Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows/Linux)
- Si tienes la app instalada como PWA: ciérrala completamente y vuelve a abrirla
- Si insiste: incrementa el `CACHE_NAME` en `sw.js`

**Quiero un dominio propio**
- Compra un dominio en cualquier registrador
- En tu DNS, añade un registro CNAME apuntando a `TU-USUARIO.github.io`
- En GitHub → Settings → Pages → Custom domain, introdúcelo

---

## Privacidad

DosisPed funciona **íntegramente en el navegador del usuario**. No envía datos a ningún servidor: el peso, edad y prescripción del paciente se guardan únicamente en `localStorage` del propio dispositivo. Esto cumple con privacidad por diseño.

Por eso GitHub Pages (que sirve archivos estáticos) es ideal: no procesa información de pacientes, solo entrega los archivos HTML/CSS/JS al navegador.
