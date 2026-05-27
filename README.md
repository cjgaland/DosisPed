# DosisPed

> Calculadora pediátrica de dosis y perfusiones para urgencias, planta, UCI pediátrica, neonatología y consultas externas.

**DosisPed** es una herramienta clínica de apoyo diseñada para pediatras y enfermería pediátrica. Calcula dosis intermitentes (oral, IV, IM, rectal, nebulizada…), perfusiones continuas en UCIP, dosis de carga, dosis puntuales y volúmenes según los preparados comerciales españoles. Incluye un módulo neonatal con dosificación por edad gestacional y edad postnatal.

## ✨ Características

- **91 fármacos** en orden alfabético, todos validados según Pediamécum (AEP), SEUP, Neofax/SEN, AEMPS y Harriet Lane
- **4 modos de administración**: intermitente, perfusión continua, carga + mantenimiento, dosis puntual
- **Paciente**: peso, edad (años / meses / días) y modo neonato con edad gestacional + edad postnatal
- **Preparados comerciales españoles** con cálculo automático de volumen del jarabe
- **Topes absolutos** de dosis máxima por toma y por día con alertas no bloqueantes
- **Slider de seguridad** en perfusiones (gradiente verde/ámbar/rojo)
- **Slider de ajuste fino** en intermitente (factor 0,5× – 1,5×)
- **Vista paciente** con resumen de prescripción multi-fármaco, imprimible, copiable y compartible por enlace
- **Historial de la sesión** (últimos 15 fármacos consultados)
- **Modo claro / oscuro**, decimal con coma, totalmente responsive
- **PWA**: funciona offline, instalable como app en móvil/tablet
- **Modal de bienvenida** con disclaimer obligatorio y modal "Acerca de" con todas las fuentes citadas

## 🚀 Cómo usarla

### Opción A — Online (recomendado)

Abre **[https://cjgaland.github.io/DosisPed/](https://cjgaland.github.io/DosisPed/)** en tu navegador.

En móvil, una vez cargada, toca el botón "Compartir" → "Añadir a pantalla de inicio" para instalarla como app nativa con su icono.

### Opción B — Local

1. Descarga el repositorio (Code → Download ZIP) y descomprime
2. Abre `index.html` con doble clic (cualquier navegador moderno funciona)

## 📚 Fuentes

Las dosis están basadas en, por orden de prioridad:

1. **Pediamécum** — Comité de Medicamentos de la Asociación Española de Pediatría (AEP). *Referencia maestra*.
2. **SEUP** — Sociedad Española de Urgencias Pediátricas. *Prioritaria en contexto de urgencias*.
3. **Neofax** / **Guías SEN** — Neonatología (edad gestacional + edad postnatal).
4. **Ficha técnica AEMPS** — *cima.aemps.es*.
5. **Harriet Lane Handbook** (Johns Hopkins) y **Lexicomp Pediatric & Neonatal Dosage Handbook** como complemento.

## ⚠️ Aviso legal

DosisPed es una **herramienta de apoyo clínico**, no un sustituto del juicio profesional. Todas las decisiones de prescripción, así como la verificación de dosis, vía e indicación, deben ser realizadas y supervisadas por un profesional sanitario cualificado con conocimiento del paciente y su contexto. Los autores no se hacen responsables del uso indebido ni de errores derivados de datos desactualizados.

## 🛠 Stack técnico

- HTML / CSS / JavaScript puro
- Sin frameworks, sin bundlers, sin dependencias externas
- Service Worker para uso offline (PWA)
- Tipografías: Inter (UI) y JetBrains Mono (números)

## 👤 Autor

**Carlos J. Galán Doval** — Pediatra

---

## 📦 Despliegue en GitHub Pages (para uso real)

Si quieres alojar tu copia con una URL pública:

1. Crea un nuevo repositorio en GitHub (público): por ejemplo `dosisped`
2. Sube todos los archivos del proyecto (puedes arrastrarlos a la web de GitHub o usar Git)
3. Ve a **Settings → Pages**
4. En **Source**, selecciona la rama `main` y carpeta `/ (root)`
5. Pulsa **Save**
6. En unos segundos, GitHub te dará una URL del tipo `https://tu-usuario.github.io/dosisped/`
7. Visítala desde cualquier dispositivo: en móvil, "Añadir a pantalla de inicio" la instala como app

Cualquier cambio que subas al repositorio se publica automáticamente en menos de un minuto.

## 📄 Licencia

Uso clínico personal y educativo. Para uso institucional o derivado, contactar con el autor.
