/* ═══════════════════════════════════════════════════════════
   RESUMEN — la pantalla que contesta, sin scrollear, las tres
   preguntas de siempre: cuánto entró, cuánto falta que entre,
   y cuánto te queda a vos.
   ═══════════════════════════════════════════════════════════ */

import {
  resumenDelMes, pesosDe, mesDeHoy, hoyISO, mesLargo, correrMes,
  distanciaMeses, mesDeFecha, claveEntrega, rentabilidadCliente,
} from '../estado.js';
import { plata, plataCorta, fecha, texto, tarjetaNumero, chip, vacio } from '../ui.js';

export default {
  ruta: 'resumen',
  titulo: 'Resumen',
  icono: '◆',

  dibujar(e, ctx) {
    const { mes } = ctx;
    const r = resumenDelMes(e, mes);
    const esMesActual = mes === mesDeHoy();

    return `
      ${cabecera(r, mes, esMesActual)}
      ${alertas(e, mes)}
      <div class="dos-columnas">
        ${proximosCobros(e, mes)}
        ${aPagar(e, mes)}
      </div>
      ${porCliente(e, mes)}
    `;
  },
};

// ── Los cuatro números grandes ───────────────────────────────
function cabecera(r, mes, esMesActual) {
  const tono = r.neto >= 0 ? 'bien' : 'mal';
  return `
    <section class="bloque">
      <div class="bloque-cabeza">
        <h2 class="bloque-titulo">${esMesActual ? 'Este mes' : mesLargo(mes)}</h2>
        <span class="bloque-nota">${r.margen}% te queda de lo que facturás</span>
      </div>
      <div class="numeros">
        ${tarjetaNumero({
          etiqueta: 'Te queda',
          valor: plataCorta(r.neto),
          detalle: 'si cobrás todo y pagás todo',
          tono,
        })}
        ${tarjetaNumero({
          etiqueta: 'Facturado',
          valor: plataCorta(r.facturado),
          detalle: `${plata(r.cobrado)} ya cobrado`,
        })}
        ${tarjetaNumero({
          etiqueta: 'Falta cobrar',
          valor: plataCorta(r.porCobrar),
          detalle: r.atrasado ? `${plata(r.atrasado)} atrasado` : 'nada atrasado',
          tono: r.atrasado ? 'alerta' : '',
        })}
        ${tarjetaNumero({
          etiqueta: 'En mano hoy',
          valor: plataCorta(r.enMano),
          detalle: 'cobrado menos lo ya pagado',
        })}
      </div>
      <div class="desglose">
        <span>Al equipo <strong>${plata(r.equipoTotal)}</strong></span>
        <span>Gastos <strong>${plata(r.gastoTotal)}</strong></span>
        <span>Pagado al equipo <strong>${plata(r.equipoPagado)}</strong></span>
      </div>
    </section>`;
}

// ── Lo que hay que mirar ya ──────────────────────────────────
function alertas(e, mes) {
  const hoy = hoyISO();
  const avisos = [];

  e.movimientos
    .filter((m) => m.tipo === 'cobro' && m.estado === 'pendiente' && m.fecha < hoy)
    .forEach((m) => {
      const dias = Math.round((new Date(hoy) - new Date(m.fecha)) / 86400000);
      avisos.push({
        tono: 'mal',
        texto: `${m.concepto} debía pagar el ${fecha(m.fecha)} — ${dias} ${dias === 1 ? 'día' : 'días'} de atraso`,
        accion: { nombre: 'cobrado', id: m.id, texto: 'Ya me pagó' },
      });
    });

  // Contratos de 3 meses que se cumplen: hay que renovar o ajustar.
  e.clientes.forEach((c) => {
    if (c.estado !== 'activo' || c.tipo !== 'mensual' || !c.inicio) return;
    const corridos = distanciaMeses(mesDeFecha(c.inicio), mes) + 1;
    if (corridos > 0 && corridos % 3 === 0) {
      avisos.push({
        tono: 'atencion',
        texto: `${c.nombre} cierra su ciclo de 3 meses este mes. Toca renovar, ajustar el precio o cerrar.`,
      });
    }
  });

  // Entregas flojas cuando ya pasó la mitad del mes.
  if (mes === mesDeHoy() && new Date().getDate() > 20) {
    e.clientes.forEach((c) => {
      const lista = e.entregas[claveEntrega(c.id, mes)];
      if (!lista) return;
      const faltan = lista.filter((t) =>
        t.tipo === 'cuenta' ? (t.hechos || 0) < t.meta : !t.hecho
      );
      if (faltan.length) {
        avisos.push({
          tono: 'atencion',
          texto: `${c.nombre}: quedan ${faltan.length} cosas sin entregar y el mes se termina.`,
        });
      }
    });
  }

  if (!avisos.length) {
    return `<section class="bloque">
      <div class="aviso bien"><span class="aviso-punto"></span>
        <p>Nada atrasado y nada pendiente de urgencia. Andá a trabajar tranquila.</p></div>
    </section>`;
  }

  return `<section class="bloque">
    <div class="bloque-cabeza"><h2 class="bloque-titulo">Mirá esto</h2></div>
    <div class="avisos">
      ${avisos
        .slice(0, 8)
        .map(
          (a) => `<div class="aviso ${a.tono}">
            <span class="aviso-punto"></span>
            <p>${texto(a.texto)}</p>
            ${a.accion ? `<button class="btn btn-chico btn-fantasma" data-accion="${a.accion.nombre}" data-id="${a.accion.id}">${texto(a.accion.texto)}</button>` : ''}
          </div>`
        )
        .join('')}
    </div>
  </section>`;
}

function proximosCobros(e, mes) {
  const lista = e.movimientos
    .filter((m) => m.tipo === 'cobro' && m.mes === mes && m.estado === 'pendiente')
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  return `<section class="bloque">
    <div class="bloque-cabeza"><h2 class="bloque-titulo">Te tienen que pagar</h2></div>
    ${
      lista.length
        ? `<ul class="lista">${lista
            .map(
              (m) => `<li class="fila">
                <div class="fila-texto">
                  <strong>${texto(m.concepto)}</strong>
                  <span>${fecha(m.fecha)}</span>
                </div>
                <div class="fila-fin">
                  <span class="fila-monto">${plata(pesosDe(m, e.ajustes))}</span>
                  <button class="btn btn-chico" data-accion="cobrado" data-id="${m.id}">Cobré</button>
                </div>
              </li>`
            )
            .join('')}</ul>`
        : vacio('Este mes ya está todo cobrado.')
    }
  </section>`;
}

function aPagar(e, mes) {
  const lista = e.movimientos
    .filter((m) => (m.tipo === 'pago' || m.tipo === 'gasto') && m.mes === mes && m.estado === 'pendiente')
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  return `<section class="bloque">
    <div class="bloque-cabeza"><h2 class="bloque-titulo">Tenés que pagar</h2></div>
    ${
      lista.length
        ? `<ul class="lista">${lista
            .map(
              (m) => `<li class="fila">
                <div class="fila-texto">
                  <strong>${texto(m.concepto)}</strong>
                  <span>${m.tipo === 'gasto' ? 'Gasto' : 'Equipo'} · ${fecha(m.fecha)}</span>
                </div>
                <div class="fila-fin">
                  <span class="fila-monto">${plata(pesosDe(m, e.ajustes))}</span>
                  <button class="btn btn-chico" data-accion="pagado" data-id="${m.id}">Pagué</button>
                </div>
              </li>`
            )
            .join('')}</ul>`
        : vacio('No queda nada por pagar este mes.')
    }
  </section>`;
}

// ── Cuánto deja cada cliente ─────────────────────────────────
function porCliente(e, mes) {
  const activos = e.clientes.filter((c) =>
    e.movimientos.some((m) => m.mes === mes && m.clienteId === c.id)
  );
  if (!activos.length) return '';

  const filas = activos
    .map((c) => ({ c, r: rentabilidadCliente(e, c, mes) }))
    .sort((a, b) => b.r.queda - a.r.queda);

  return `<section class="bloque">
    <div class="bloque-cabeza">
      <h2 class="bloque-titulo">Qué te deja cada cliente</h2>
      <span class="bloque-nota">lo que paga menos lo que le pagás al equipo por él</span>
    </div>
    <ul class="lista">
      ${filas
        .map(
          ({ c, r }) => `<li class="fila">
            <div class="fila-texto">
              <strong>${texto(c.nombre)}</strong>
              <span>${plata(r.entra)} entra · ${plata(r.sale)} sale</span>
            </div>
            <div class="fila-fin">
              ${chip(`${r.margen}%`, r.margen >= 50 ? 'bien' : r.margen >= 25 ? 'aviso' : 'mal')}
              <span class="fila-monto">${plata(r.queda)}</span>
            </div>
          </li>`
        )
        .join('')}
    </ul>
  </section>`;
}
