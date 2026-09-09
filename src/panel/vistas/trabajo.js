/* ═══════════════════════════════════════════════════════════
   TRABAJO — qué hay que entregarle a cada cliente este mes y
   cuánto de eso ya salió.

   La lista se arma sola con el plan que tiene contratado: si
   es CRECIMIENTO son 8 posteos, 26 historias, reporte y
   reunión. No hay que acordarse de nada.
   ═══════════════════════════════════════════════════════════ */

import { mutar, claveEntrega, mesLargo, nombreServicio } from '../estado.js';
import { texto, vacio, chip } from '../ui.js';

export default {
  ruta: 'trabajo',
  titulo: 'Trabajo',
  icono: '✓',

  dibujar(e, ctx) {
    const { mes } = ctx;
    const activos = e.clientes.filter((c) => c.estado === 'activo');

    if (!activos.length) {
      return `<section class="bloque">${vacio(
        'Cuando tengas clientes activos, acá aparece mes a mes todo lo que hay que entregarles.'
      )}</section>`;
    }

    const conLista = activos.filter((c) => e.entregas[claveEntrega(c.id, mes)]);
    if (!conLista.length) {
      return `<section class="bloque">${vacio(
        `Todavía no hay entregas armadas para ${mesLargo(mes)}. Se arman solas en cuanto el mes empieza.`
      )}</section>`;
    }

    const total = conLista.reduce((t, c) => t + progreso(e, c, mes).total, 0);
    const hechos = conLista.reduce((t, c) => t + progreso(e, c, mes).hechos, 0);

    return `<section class="bloque">
      <div class="bloque-cabeza">
        <h2 class="bloque-titulo">${mesLargo(mes)}</h2>
        <span class="bloque-nota">${hechos} de ${total} entregado</span>
      </div>
      <div class="tarjetas">
        ${conLista.map((c) => tarjeta(c, e, mes)).join('')}
      </div>
    </section>`;
  },

  accion(nombre, datos, e, ctx) {
    const { mes } = ctx;
    if (nombre === 'entrega-check') return alternar(datos.cliente, mes, datos.clave);
    if (nombre === 'entrega-mas') return contar(datos.cliente, mes, datos.clave, 1);
    if (nombre === 'entrega-menos') return contar(datos.cliente, mes, datos.clave, -1);
  },
};

function progreso(e, cliente, mes) {
  const lista = e.entregas[claveEntrega(cliente.id, mes)] || [];
  let total = 0;
  let hechos = 0;
  lista.forEach((t) => {
    if (t.tipo === 'cuenta') {
      total += t.meta;
      hechos += Math.min(t.hechos || 0, t.meta);
    } else {
      total += 1;
      hechos += t.hecho ? 1 : 0;
    }
  });
  return { total, hechos, porcentaje: total ? Math.round((hechos / total) * 100) : 0 };
}

function tarjeta(c, e, mes) {
  const lista = e.entregas[claveEntrega(c.id, mes)] || [];
  const p = progreso(e, c, mes);

  return `<article class="tarjeta">
    <header class="tarjeta-cabeza">
      <div>
        <h3>${texto(c.nombre)}</h3>
        <p class="tarjeta-bajada">${texto(c.plan || nombreServicio(c.servicio))}</p>
      </div>
      ${chip(`${p.porcentaje}%`, p.porcentaje === 100 ? 'bien' : p.porcentaje >= 50 ? 'aviso' : 'mal')}
    </header>

    <div class="progreso" role="img" aria-label="${p.hechos} de ${p.total} entregado">
      <span style="width:${p.porcentaje}%"></span>
    </div>

    <ul class="entregas">
      ${lista.map((t) => item(c.id, t)).join('')}
    </ul>
  </article>`;
}

function item(clienteId, t) {
  if (t.tipo === 'cuenta') {
    const hechos = t.hechos || 0;
    const completo = hechos >= t.meta;
    return `<li class="entrega${completo ? ' completa' : ''}">
      <span class="entrega-texto">${texto(t.texto)}</span>
      <span class="contador">
        <button class="icono-btn" data-accion="entrega-menos" data-cliente="${clienteId}" data-clave="${t.clave}" aria-label="Restar uno a ${texto(t.texto)}">−</button>
        <strong>${hechos}<em>/${t.meta}</em></strong>
        <button class="icono-btn" data-accion="entrega-mas" data-cliente="${clienteId}" data-clave="${t.clave}" aria-label="Sumar uno a ${texto(t.texto)}">+</button>
      </span>
    </li>`;
  }

  return `<li class="entrega${t.hecho ? ' completa' : ''}">
    <button class="tilde${t.hecho ? ' marcada' : ''}" data-accion="entrega-check" data-cliente="${clienteId}" data-clave="${t.clave}"
      aria-label="${t.hecho ? 'Desmarcar' : 'Marcar'} ${texto(t.texto)}">✓</button>
    <span class="entrega-texto">${texto(t.texto)}</span>
  </li>`;
}

function alternar(clienteId, mes, clave) {
  mutar((s) => {
    const lista = s.entregas[claveEntrega(clienteId, mes)];
    const t = lista && lista.find((x) => x.clave === clave);
    if (t) t.hecho = !t.hecho;
  });
}

function contar(clienteId, mes, clave, paso) {
  mutar((s) => {
    const lista = s.entregas[claveEntrega(clienteId, mes)];
    const t = lista && lista.find((x) => x.clave === clave);
    if (!t) return;
    t.hechos = Math.max(0, (t.hechos || 0) + paso);
  });
}
