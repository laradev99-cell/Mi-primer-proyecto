/* ═══════════════════════════════════════════════════════════
   PROPUESTAS — lo que todavía no es cliente pero puede serlo.

   Sirve para dos cosas: no perder de vista a nadie que te
   escribió, y ver cuánta plata hay dando vueltas ahí afuera
   antes de que entre.
   ═══════════════════════════════════════════════════════════ */

import { mutar, id, SERVICIOS, nombreServicio, enPesos, hoyISO, sincronizarMeses } from '../estado.js';
import { plata, fecha, texto, formulario, confirmar, vacio, chip } from '../ui.js';

const ETAPAS = [
  { valor: 'contactado', nombre: 'Me escribió', tono: '' },
  { valor: 'reunion', nombre: 'Reunión hecha', tono: '' },
  { valor: 'enviada', nombre: 'Propuesta enviada', tono: 'aviso' },
  { valor: 'negociando', nombre: 'Negociando', tono: 'aviso' },
  { valor: 'ganado', nombre: 'Cerró', tono: 'bien' },
  { valor: 'perdido', nombre: 'No fue', tono: 'mal' },
];

export default {
  ruta: 'propuestas',
  titulo: 'Propuestas',
  icono: '◇',

  dibujar(e) {
    if (!e.propuestas.length) {
      return `<section class="bloque">${vacio(
        'Acá va todo el que te escribió y todavía no cerró. Cargalo apenas te habla y no se te pierde ninguno.',
        { accion: 'nueva-propuesta', texto: 'Cargar la primera' }
      )}</section>`;
    }

    const abiertas = e.propuestas.filter((p) => !['ganado', 'perdido'].includes(p.etapa));
    const enJuego = abiertas.reduce((t, p) => t + enPesos(p.monto, p.moneda, e.ajustes.dolar), 0);
    const cerradas = e.propuestas.filter((p) => p.etapa === 'ganado').length;
    const perdidas = e.propuestas.filter((p) => p.etapa === 'perdido').length;
    const efectividad = cerradas + perdidas ? Math.round((cerradas / (cerradas + perdidas)) * 100) : null;

    return `<section class="bloque">
      <div class="bloque-cabeza">
        <h2 class="bloque-titulo">${abiertas.length} en juego</h2>
        <span class="bloque-nota">${plata(enJuego)} sobre la mesa${efectividad !== null ? ` · cerrás ${efectividad} de cada 100` : ''}</span>
        <button class="btn btn-lleno btn-chico" data-accion="nueva-propuesta">+ Propuesta</button>
      </div>

      ${ETAPAS.map((etapa) => columna(etapa, e)).join('')}
    </section>`;
  },

  async accion(nombre, datos, e) {
    if (nombre === 'nueva-propuesta') return crear();
    if (nombre === 'editar-propuesta') return editar(e, datos.id);
    if (nombre === 'borrar-propuesta') return borrar(e, datos.id);
    if (nombre === 'mover-propuesta') return mover(e, datos.id, datos.valor);
    if (nombre === 'a-cliente') return aCliente(e, datos.id);
  },
};

function columna(etapa, e) {
  const lista = e.propuestas.filter((p) => p.etapa === etapa.valor);
  if (!lista.length) return '';

  return `<div class="etapa">
    <h3 class="etapa-titulo">${etapa.nombre} <span>${lista.length}</span></h3>
    <ul class="lista">
      ${lista
        .map(
          (p) => `<li class="fila">
            <div class="fila-texto">
              <strong>${texto(p.nombre)}</strong>
              <span>${texto(nombreServicio(p.servicio))} · ${fecha(p.fecha)}${p.contacto ? ` · ${texto(p.contacto)}` : ''}</span>
              ${p.notas ? `<span class="fila-nota">${texto(p.notas)}</span>` : ''}
            </div>
            <div class="fila-fin">
              <span class="fila-monto">${plata(p.monto, p.moneda)}</span>
              <select class="mini-select" data-accion="mover-propuesta" data-id="${p.id}" aria-label="Cambiar etapa de ${texto(p.nombre)}">
                ${ETAPAS.map((et) => `<option value="${et.valor}"${et.valor === p.etapa ? ' selected' : ''}>${et.nombre}</option>`).join('')}
              </select>
              ${p.etapa === 'ganado' ? `<button class="btn btn-chico btn-lleno" data-accion="a-cliente" data-id="${p.id}">Pasar a cliente</button>` : ''}
              <button class="icono-btn" data-accion="editar-propuesta" data-id="${p.id}" aria-label="Editar">✎</button>
              <button class="icono-btn" data-accion="borrar-propuesta" data-id="${p.id}" aria-label="Borrar">✕</button>
            </div>
          </li>`
        )
        .join('')}
    </ul>
  </div>`;
}

function campos() {
  return [
    { clave: 'nombre', etiqueta: 'Marca o persona', tipo: 'texto', requerido: true },
    { clave: 'contacto', etiqueta: 'Contacto', tipo: 'texto', placeholder: 'WhatsApp, Instagram, mail' },
    { clave: 'servicio', etiqueta: 'Qué quiere', tipo: 'opciones', opciones: SERVICIOS.map((s) => ({ valor: s.valor, nombre: s.nombre })) },
    { clave: 'monto', etiqueta: 'Cuánto le cotizaste', tipo: 'plata', requerido: true },
    { clave: 'moneda', etiqueta: 'Moneda', tipo: 'opciones', opciones: [{ valor: 'ARS', nombre: 'Pesos' }, { valor: 'USD', nombre: 'Dólares' }] },
    { clave: 'etapa', etiqueta: 'En qué está', tipo: 'opciones', opciones: ETAPAS.map((et) => ({ valor: et.valor, nombre: et.nombre })) },
    { clave: 'fecha', etiqueta: 'Desde cuándo', tipo: 'fecha', requerido: true },
    { clave: 'notas', etiqueta: 'Notas', tipo: 'nota', placeholder: 'Qué te pidió, qué le prometiste, cuándo hay que volver a escribirle.' },
  ];
}

async function crear() {
  const datos = await formulario({
    titulo: 'Nueva propuesta',
    campos: campos(),
    valores: { etapa: 'contactado', moneda: 'ARS', fecha: hoyISO() },
  });
  if (!datos) return;
  mutar((s) => s.propuestas.push({ id: id(), ...datos }));
}

async function editar(e, propId) {
  const p = e.propuestas.find((x) => x.id === propId);
  if (!p) return;
  const datos = await formulario({ titulo: `Editar ${p.nombre}`, campos: campos(), valores: p });
  if (!datos) return;
  mutar((s) => Object.assign(s.propuestas.find((x) => x.id === propId), datos));
}

function mover(e, propId, etapa) {
  mutar((s) => {
    const p = s.propuestas.find((x) => x.id === propId);
    if (p) p.etapa = etapa;
  });
}

async function borrar(e, propId) {
  const p = e.propuestas.find((x) => x.id === propId);
  if (!p) return;
  const ok = await confirmar(`¿Borrar la propuesta de ${p.nombre}?`);
  if (!ok) return;
  mutar((s) => {
    s.propuestas = s.propuestas.filter((x) => x.id !== propId);
  });
}

/** Cerró: pasa a la lista de clientes y deja de ocupar el embudo. */
async function aCliente(e, propId) {
  const p = e.propuestas.find((x) => x.id === propId);
  if (!p) return;

  const datos = await formulario({
    titulo: `${p.nombre} ahora es cliente`,
    campos: [
      { clave: 'tipo', etiqueta: 'Cómo te paga', tipo: 'opciones', opciones: [{ valor: 'mensual', nombre: 'Todos los meses' }, { valor: 'unico', nombre: 'Una sola vez' }] },
      { clave: 'monto', etiqueta: 'Cuánto', tipo: 'plata', requerido: true },
      { clave: 'diaCobro', etiqueta: 'Qué día te paga', tipo: 'dia' },
      { clave: 'inicio', etiqueta: 'Arranca el', tipo: 'fecha', requerido: true },
    ],
    valores: { tipo: 'mensual', monto: p.monto, diaCobro: 1, inicio: hoyISO() },
    textoBoton: 'Pasarlo a clientes',
  });
  if (!datos) return;

  mutar((s) => {
    s.clientes.push({
      id: id(),
      nombre: p.nombre,
      contacto: p.contacto,
      servicio: p.servicio,
      plan: null,
      moneda: p.moneda,
      estado: 'activo',
      notas: p.notas,
      equipo: [],
      ...datos,
    });
    s.propuestas = s.propuestas.filter((x) => x.id !== propId);
  });
  sincronizarMeses();
}
