// Configuración general del sitio.
// Todo lo que se cambia sin tocar el diseño vive acá.

// ─────────────────────────────────────────────────────────────
// WHATSAPP
// El link corto (wa.me/message/XXXX) NO admite mensaje precargado.
// Para que cada botón abra el chat con un texto ya escrito hace falta
// el número en formato internacional sin + ni espacios. Ej: 5491122334455
// Mientras esté vacío, todos los botones caen al link corto sin mensaje.
// ─────────────────────────────────────────────────────────────
// El 9 después del 54 es el que WhatsApp pide para celulares argentinos.
// Si algún botón no abre el chat, probá sacándolo: 541123921163
export const WHATSAPP_NUMERO = '5491123921163';
export const WHATSAPP_LINK_CORTO = 'https://wa.me/message/RVXNEXMKBJIYC1';

export function whatsapp(mensaje = '') {
  if (!WHATSAPP_NUMERO) return WHATSAPP_LINK_CORTO;
  const base = `https://wa.me/${WHATSAPP_NUMERO}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

// Mensaje precargado distinto según desde dónde se escribe
export const mensajes = {
  hero: 'Hola Lara, vi la web de Naimid y quiero saber más.',
  servicios: 'Hola Lara, me interesa uno de los servicios de Naimid.',
  cierre: 'Hola Lara, quiero coordinar el diagnóstico de 30 minutos.',
  footer: 'Hola Lara, te escribo desde la web de Naimid.',
  propuesta: 'Hola Lara, tengo una duda sobre la propuesta.',
  arrancar: 'Hola Lara, quiero arrancar. ¿Coordinamos la fecha de inicio?',
};

// ─────────────────────────────────────────────────────────────
// CAL.COM
// Cuando crees la cuenta, poné acá tu link: 'lara/diagnostico'
// (solo la parte de después de cal.com/). Mientras esté vacío,
// la sección muestra un aviso en lugar del calendario.
// ─────────────────────────────────────────────────────────────
export const CAL_LINK = '';

// ─────────────────────────────────────────────────────────────
// REDES
// ─────────────────────────────────────────────────────────────
export const redes = {
  instagram: 'https://instagram.com/naimid.agency',
  tiktok: 'https://tiktok.com/@naimid.agency',
};

export const marca = {
  nombre: 'Naimid.Agency',
  descripcion:
    'Estrategia, contenido y desarrollo web para marcas que venden online.',
};
