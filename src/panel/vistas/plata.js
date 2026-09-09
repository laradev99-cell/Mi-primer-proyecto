/* ═══════════════════════════════════════════════════════════
   PLATA — el libro completo: todo lo que entra y todo lo que
   sale, mes por mes. Acá se marca "ya me pagó" y "ya le pagué".

   Abajo, el historial: doce meses de facturación y de lo que
   te quedó. Es el único lugar del panel donde se ve la película
   entera en vez de la foto del mes.
   ═══════════════════════════════════════════════════════════ */

import {
  mutar, id, pesosDe, resumenDelMes, mesDeHoy, hoyISO, mesLargo, correrMes,
} from '../estado.js';
import { plata, plataCorta, fecha, texto, formulario, confirmar, vacio, chip } from '../ui.js';

const FILTROS = [
  { valor: 'pendiente', nombre: 'Pendiente' },
  { valor: 'todo', nombre: 'Todo' },
  { valor: 'cobro', nombre: 'Entra' },
  { valor: 'pago', nombre: 'Equipo' },
  { valor: 'gasto', nombre: 'Gastos' },
];

let filtro = 'pendiente';

export default {
  ruta: 'plata',
  titulo: 'Plata',
  icono: '$',

  dibujar(e, ctx) {
    const { mes } = ctx;
    const r = resumenDelMes(e, mes);

    const movimientos = e.movimientos
      .filter((m) => m.mes === mes)
      .filter((m) =>
        filtro === 'todo' ? true : filtro === 'pendiente' ? m.estado === 'pendiente' : m.tipo === filtro
      )
      .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.concepto.localeCompare(b.concepto));

    return `
      <section class="bloque">
        <div class="bloque-cabeza">
          <h2 class="bloque-titulo">${mesLargo(mes)}</h2>
          <span class="bloque-nota">${plata(r.facturado)} facturado · ${plata(r.neto)} te queda</span>
          <button class="btn btn-lleno btn-chico" data-accion="nuevo-movimiento">+ Movimiento</button>
        </div>

        <div class="filtros" role="group" aria-label="Filtrar movimientos">
          ${FILTROS.map(
            (f) =>
              `<button class="filtro${f.valor === filtro ? ' activo' : ''}" data-accion="filtro" data-valor="${f.valor}">${f.nombre}</button>`
          ).join('')}
        </div>

        ${
          movimientos.length
            ? `<ul class="lista">${movimientos.map((m) => fila(m, e)).join('')}</ul>`
            : vacio(
                filtro === 'pendiente'
                  ? 'No queda nada pendiente en este mes. Está todo cobrado y todo pagado.'
                  : 'No hay movimientos con ese filtro.'
              )
        }
      </section>

      ${historial(e, mes)}
    `;
  },

  async accion(nombre, datos, e, ctx) {
    if (nombre === 'filtro') {
      filtro = datos.valor;
      return;
    }
    if (nombre === 'alternar') return alternar(datos.id);
    if (nombre === 'nuevo-movimiento') return nuevo(ctx.mes);
    if (nombre === 'editar-movimiento') return editar(e, datos.id);
    if (nombre === 'borrar-movimiento') return borrar(e, datos.id);
    if (nombre === 'ir-mes') ctx.irAlMes(datos.valor);
  },
};

const SIGNO = { cobro: '+', pago: '−', gasto: '−' };
const ETIQUETA = { cobro: 'Entra', pago: 'Equipo', gasto: 'Gasto' };

function fila(m, e) {
  const atrasado = m.tipo === 'cobro' && m.estado === 'pendiente' && m.fecha < hoyISO();
  return `<li class="fila${m.estado === 'hecho' ? ' hecha' : ''}">
    <button class="tilde${m.estado === 'hecho' ? ' marcada' : ''}" data-accion="alternar" data-id="${m.id}"
      aria-label="${m.estado === 'hecho' ? 'Marcar como pendiente' : 'Marcar como hecho'}">✓</button>
    <div class="fila-texto">
      <strong>${texto(m.concepto)}</strong>
      <span>${ETIQUETA[m.tipo]} · ${fecha(m.fecha)}</span>
    </div>
    <div class="fila-fin">
      ${atrasado ? chip('atrasado', 'mal') : ''}
      <span class="fila-monto ${m.tipo === 'cobro' ? 'positivo' : 'negativo'}">${SIGNO[m.tipo]}${plata(pesosDe(m, e.ajustes))}</span>
      <button class="icono-btn" data-accion="editar-movimiento" data-id="${m.id}" aria-label="Editar">✎</button>
      <button class="icono-btn" data-accion="borrar-movimiento" data-id="${m.id}" aria-label="Borrar">✕</button>
    </div>
  </li>`;
}

// ═══════════════════════════════════════════════════════════
// HISTORIAL — doce meses
//
// La barra entera es lo que facturaste; la parte llena, lo que
// te quedó. Los números van escritos al lado: la barra es para
// ver la forma de un vistazo, no para adivinar el valor.
// ═══════════════════════════════════════════════════════════
function historial(e, mesActual) {
  const meses = [];
  for (let i = 11; i >= 0; i--) meses.push(correrMes(mesDeHoy(), -i));

  const datos = meses.map((m) => ({ mes: m, ...resumenDelMes(e, m) }));
  const conMovimiento = datos.filter((d) => d.facturado || d.gastoTotal || d.equipoTotal);
  if (conMovimiento.length < 2) return '';

  const tope = Math.max(...conMovimiento.map((d) => Math.max(d.facturado, Math.abs(d.neto))));
  const total = conMovimiento.reduce(
    (t, d) => ({ facturado: t.facturado + d.facturado, neto: t.neto + d.neto }),
    { facturado: 0, neto: 0 }
  );

  return `<section class="bloque">
    <div class="bloque-cabeza">
      <h2 class="bloque-titulo">Cómo venís</h2>
      <span class="bloque-nota">${plata(total.facturado)} facturado · ${plata(total.neto)} para vos</span>
    </div>
    <p class="leyenda">
      <span class="leyenda-item"><i class="muestra hueca"></i>lo que facturaste</span>
      <span class="leyenda-item"><i class="muestra llena"></i>lo que te quedó</span>
    </p>
    <ul class="historial">
      ${conMovimiento
        .map((d) => {
          const anchoTotal = tope ? (d.facturado / tope) * 100 : 0;
          const anchoNeto = tope ? (Math.max(d.neto, 0) / tope) * 100 : 0;
          return `<li class="historial-fila${d.mes === mesActual ? ' actual' : ''}">
            <button class="historial-mes" data-accion="ir-mes" data-valor="${d.mes}">${mesLargo(d.mes).replace(/ \d{4}$/, '')}</button>
            <div class="barra" role="img" aria-label="${mesLargo(d.mes)}: facturado ${plata(d.facturado)}, te quedó ${plata(d.neto)}">
              <span class="barra-total" style="width:${anchoTotal.toFixed(1)}%"></span>
              <span class="barra-neto${d.neto < 0 ? ' negativa' : ''}" style="width:${anchoNeto.toFixed(1)}%"></span>
            </div>
            <span class="historial-valor ${d.neto >= 0 ? 'positivo' : 'negativo'}">${plataCorta(d.neto)}</span>
          </li>`;
        })
        .join('')}
    </ul>
  </section>`;
}

// ═══════════════════════════════════════════════════════════
// ACCIONES
// ═══════════════════════════════════════════════════════════

function alternar(movId) {
  mutar((s) => {
    const m = s.movimientos.find((x) => x.id === movId);
    if (!m) return;
    m.estado = m.estado === 'hecho' ? 'pendiente' : 'hecho';
    m.fechaReal = m.estado === 'hecho' ? hoyISO() : null;
  });
}

function camposMovimiento() {
  return [
    {
      clave: 'tipo', etiqueta: 'Qué es', tipo: 'opciones',
      opciones: [
        { valor: 'cobro', nombre: 'Entra plata' },
        { valor: 'pago', nombre: 'Le pago a alguien del equipo' },
        { valor: 'gasto', nombre: 'Un gasto' },
      ],
    },
    { clave: 'concepto', etiqueta: 'De qué se trata', tipo: 'texto', requerido: true, placeholder: 'Ej: extra de edición de Marca X' },
    { clave: 'monto', etiqueta: 'Cuánto', tipo: 'plata', requerido: true },
    { clave: 'moneda', etiqueta: 'Moneda', tipo: 'opciones', opciones: [{ valor: 'ARS', nombre: 'Pesos' }, { valor: 'USD', nombre: 'Dólares' }] },
    { clave: 'fecha', etiqueta: 'Cuándo', tipo: 'fecha', requerido: true },
    { clave: 'estado', etiqueta: 'Estado', tipo: 'opciones', opciones: [{ valor: 'pendiente', nombre: 'Todavía no' }, { valor: 'hecho', nombre: 'Ya está' }] },
  ];
}

async function nuevo(mes) {
  const datos = await formulario({
    titulo: 'Nuevo movimiento',
    campos: camposMovimiento(),
    valores: { tipo: 'cobro', moneda: 'ARS', estado: 'pendiente', fecha: `${mes}-${String(new Date().getDate()).padStart(2, '0')}` },
    nota: 'Para lo que no es de todos los meses: un extra que cobraste, un pago suelto, una compra.',
  });
  if (!datos) return;

  mutar((s) => {
    s.movimientos.push({ id: id(), mes: datos.fecha.slice(0, 7), ...datos });
  });
}

async function editar(e, movId) {
  const m = e.movimientos.find((x) => x.id === movId);
  if (!m) return;
  const datos = await formulario({ titulo: 'Editar movimiento', campos: camposMovimiento(), valores: m });
  if (!datos) return;

  mutar((s) => {
    const mov = s.movimientos.find((x) => x.id === movId);
    Object.assign(mov, datos, { mes: datos.fecha.slice(0, 7) });
  });
}

async function borrar(e, movId) {
  const m = e.movimientos.find((x) => x.id === movId);
  if (!m) return;
  const ok = await confirmar(`¿Borrar "${m.concepto}"?`);
  if (!ok) return;
  mutar((s) => {
    const mov = s.movimientos.find((x) => x.id === movId);
    if (mov && mov.origen) {
      s.ajustes.borrados = s.ajustes.borrados || [];
      s.ajustes.borrados.push(mov.origen);
    }
    s.movimientos = s.movimientos.filter((x) => x.id !== movId);
  });
}
