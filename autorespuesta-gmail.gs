/**
 * ============================================================
 *  DosisPed — Autorespuesta automática a las sugerencias
 *  Google Apps Script (se ejecuta en la cuenta de Gmail del autor)
 * ============================================================
 *
 *  QUÉ HACE:
 *  Cada vez que se ejecuta (mediante un disparador temporal), busca los
 *  correos nuevos del buzón de sugerencias de DosisPed (los que envía
 *  Web3Forms, con asunto "DosisPed · ...") y, SOLO si el remitente dejó
 *  su email, le responde automáticamente:
 *    - Si el mensaje es un AGRADECIMIENTO  → respuesta cálida y cordial.
 *    - Si es una sugerencia / fármaco / error / otro → agradece e informa
 *      de que será tenida en cuenta.
 *  Marca cada hilo respondido con la etiqueta "DosisPed-Respondido" para
 *  no contestar dos veces.
 *
 *  INSTALACIÓN (una sola vez, ~10 minutos):
 *  1. Entra en  https://script.google.com  con tu cuenta cjgaland@gmail.com
 *  2. Pulsa "Nuevo proyecto".
 *  3. Borra el contenido de ejemplo y pega TODO este archivo.
 *  4. (Opcional) Cambia el valor de AUTOR si quieres firmar con otro nombre.
 *  5. Arriba, selecciona la función "autorresponderDosisPed" y pulsa
 *     "Ejecutar". Google te pedirá AUTORIZAR permisos de Gmail: acéptalos
 *     (es tu propia cuenta).
 *  6. En el menú lateral izquierdo, icono del reloj ("Activadores") →
 *     "Añadir activador":
 *        - Función:                 autorresponderDosisPed
 *        - Implementación:          Head
 *        - Origen del evento:       Basado en tiempo
 *        - Tipo:                    Temporizador por minutos
 *        - Intervalo:               Cada 10 minutos (o 5)
 *     Guarda. ¡Listo! A partir de ahora responde solo.
 *
 *  Para PARARLO en el futuro: borra el activador (mismo menú del reloj).
 * ============================================================
 */

// Nombre con el que se firman las respuestas
var AUTOR = "Carlos";
var APP_NOMBRE = "DosisPed";

function autorresponderDosisPed() {
  // Buscar correos del buzón: asunto contiene "DosisPed", recibidos en los
  // últimos 7 días y aún no respondidos por este script.
  var query = 'subject:DosisPed newer_than:7d -label:DosisPed-Respondido';
  var threads = GmailApp.search(query, 0, 50);
  if (!threads || !threads.length) return;

  var etiqueta = obtenerEtiqueta_("DosisPed-Respondido");
  var miCorreo = (Session.getActiveUser().getEmail() || "").toLowerCase();

  threads.forEach(function (thread) {
    try {
      var primer = thread.getMessages()[0];
      var asunto = primer.getSubject() || "";
      var cuerpo = primer.getPlainBody() || "";

      // Filtro de seguridad: que sea realmente un correo del buzón de DosisPed.
      if (asunto.indexOf("DosisPed") === -1) { return; }

      // Email del remitente: preferir el Reply-To; si no, buscarlo en el cuerpo.
      var emailRemitente = extraerEmail_(primer.getReplyTo() || "");
      if (!emailRemitente) emailRemitente = extraerEmail_(cuerpo);

      // Si no hay email válido, es el propio buzón, o es de Web3Forms → no responder.
      var noResponder = !emailRemitente ||
        emailRemitente.toLowerCase() === miCorreo ||
        /web3forms|noreply|no-reply|donotreply/i.test(emailRemitente);
      if (noResponder) {
        thread.addLabel(etiqueta); // marcar para no reprocesar
        return;
      }

      // Nombre del remitente (si lo indicó en el formulario)
      var nombre = extraerCampo_(cuerpo, "Nombre");
      if (!nombre || nombre === "(no indicado)") nombre = "";
      var saludo = nombre ? ("Hola " + nombre + ",") : "Hola,";

      // ¿Es un agradecimiento? Se detecta por el asunto ("DosisPed · Agradecimiento")
      var esAgradecimiento = /agradecimiento|gracias/i.test(asunto);

      var cuerpoRespuesta;
      if (esAgradecimiento) {
        cuerpoRespuesta = saludo + "\n\n" +
          "¡Muchísimas gracias por tus palabras! Da mucho ánimo saber que " + APP_NOMBRE +
          " te resulta útil en el día a día con los más pequeños. Comentarios como el tuyo " +
          "son la mejor recompensa y me animan a seguir mejorando la aplicación.\n\n" +
          "Un abrazo y gracias de nuevo,\n" + AUTOR + " · " + APP_NOMBRE;
      } else {
        cuerpoRespuesta = saludo + "\n\n" +
          "Muchas gracias por tu mensaje a través del buzón de " + APP_NOMBRE + ". " +
          "Lo he recibido correctamente y lo tendré muy en cuenta. Reviso personalmente " +
          "todas las propuestas (nuevos fármacos, dosis, mejoras) y las incorporo siempre " +
          "que es posible, verificándolas con las fuentes de referencia.\n\n" +
          "Gracias por ayudar a que " + APP_NOMBRE + " sea cada día mejor y más seguro.\n\n" +
          "Un cordial saludo,\n" + AUTOR + " · " + APP_NOMBRE;
      }

      // Enviar la respuesta al remitente
      GmailApp.sendEmail(emailRemitente, "Re: " + asunto, cuerpoRespuesta, {
        name: AUTOR + " · " + APP_NOMBRE
      });

      // Marcar el hilo como respondido
      thread.addLabel(etiqueta);
    } catch (err) {
      // Si algo falla con un hilo, continuar con los demás
      Logger.log("Error procesando un hilo: " + err);
    }
  });
}

// Crea la etiqueta si no existe y la devuelve
function obtenerEtiqueta_(nombre) {
  var et = GmailApp.getUserLabelByName(nombre);
  return et ? et : GmailApp.createLabel(nombre);
}

// Devuelve el primer email válido encontrado en un texto (o "")
function extraerEmail_(texto) {
  if (!texto) return "";
  var m = texto.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : "";
}

// Devuelve el valor de un campo con formato "Etiqueta: valor" del cuerpo (o "")
function extraerCampo_(texto, etiqueta) {
  if (!texto) return "";
  var re = new RegExp(etiqueta + "\\s*[:\\-]\\s*(.+)", "i");
  var m = texto.match(re);
  return m ? m[1].trim() : "";
}
