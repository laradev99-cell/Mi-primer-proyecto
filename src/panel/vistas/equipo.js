/* ═══════════════════════════════════════════════════════════
   EQUIPO — tus cinco personas: qué hace cada una, cuánto le
   pagás y cuánto le debés este mes.

   Hay dos formas de pagarle a alguien y se pueden mezclar:
   un fijo mensual que se carga acá, y lo que cobra por cada
   cliente, que se asigna desde la ficha del cliente.
   ═══════════════════════════════════════════════════════════ */

import { mutar, id, pesosDe, sincronizarMeses } from '../estado.js';
import { plata, texto, formulario, confirmar, vacio, chip } from '../ui.js';

export default {
  ruta: 'equipo',
  titulo: 'Equipo',
  icono: '▲',

  dibujar(e, ctx) {
    const { mes } = ctx;

    if (!e.equipo.length) {
      return `<section class="bloque">
        ${vacio(
          'Cargá a las personas que trabajan con vos. Después, desde cada cliente, decís quién trabaja ahí y cuánto cobra — y el panel calcula solo cuánto le debés a cada uno.',
          { accion: 'nueva-persona', texto: 'Cargar a la primera' }
        )}
      </section>`;
    }

    const pagosDelMes = e.movimientos.filter((m) => m.tipo === 'pago' && m.mes === mes);
    const total = pagosDelMes.reduce((t, m) => t + pesosDe(m, e.ajustes), 0);
    const pagado = pagosDelMes
      .filter((m) => m.estado === 'hecho')
      .reduce((t, m) => t + pesosDe(m, e.ajustes), 0);

    return `<section class="bloque">
      <div class="bloque-cabeza">
        <h2 class="bloque-titulo">${e.equipo.length} ${e.equipo.length === 1 ? 'persona' : 'personas'}</h2>
        <span class="bloque-nota">${plata(pagado)} pagado de ${plata(total)} este mes</span>
        <button class="btn btn-lleno btn-chico" data-accion="nueva-persona">+ Persona</button>
      </div>
      <div class="tarjetas">
        ${e.equipo.map((p) => tarjeta(p, e, pagosDelMes)).join('')}
      </div>
    </section>`;
  },

  async accion(nombre, datos, e) {
    if (nombre === 'nueva-persona') return crear();
    if (nombre === 'editar-persona') return editar(e, datos.id);
    if (nombre === 'borrar-persona') return borrar(e, datos.id);
  },
};

function tarjeta(p, e, pagosDelMes) {
  const suyos = pagosDelMes.filter((m) => m.personaId === p.id);
  const debe = suyos.reduce((t, m) => t + pesosDe(m, e.ajustes), 0);
  const pendiente = suyos
    .filter((m) => m.estado === 'pendiente')
    .reduce((t, m) => t + pesosDe(m, e.ajustes), 0);

  const enClientes = e.clientes
    .filter((c) => (c.equipo || []).some((a) => a.personaId === p.id))
    .map((c) => {
      const a = c.equipo.find((x) => x.personaId === p.id);
      return `<li class="mini-fila"><span>${texto(c.nombre)}</span>
        <span class="mini-fin">${a.modo === 'porcentaje' ? `${a.valor}%` : plata(a.valor)}</span></li>`;
    })
    .join('');

  return `<article class="tarjeta">
    <header class="tarjeta-cabeza">
      <div>
        <h3>${texto(p.nombre)}</h3>
        <p class="tarjeta-bajada">${texto(p.rol || 'Sin rol cargado')}</p>
      </div>
      ${pendiente ? chip('le debés', 'aviso') : chip('al día', 'bien')}
    </header>

    <dl class="datos">
      <div><dt>Este mes</dt><dd>${plata(debe)}</dd></div>
      <div><dt>Falta pagarle</dt><dd class="${pendiente ? 'negativo' : ''}">${plata(pendiente)}</dd></div>
      ${p.pagoFijo ? `<div><dt>Fijo mensual</dt><dd>${plata(p.pagoFijo)}</dd></div>` : ''}
      ${p.contacto ? `<div><dt>Contacto</dt><dd>${texto(p.contacto)}</dd></div>` : ''}
    </dl>

    <div class="tarjeta-equipo">
      <span class="campo-titulo">En qué clientes trabaja</span>
      ${enClientes ? `<ul class="mini-lista">${enClientes}</ul>` : '<p class="tarjeta-vacio">Todavía no está asignado a ningún cliente.</p>'}
    </div>

    ${p.notas ? `<p class="tarjeta-nota">${texto(p.notas)}</p>` : ''}

    <footer class="tarjeta-pie">
      <button class="btn btn-fantasma btn-chico" data-accion="editar-persona" data-id="${p.id}">Editar</button>
      <button class="btn btn-fantasma btn-chico peligro" data-accion="borrar-persona" data-id="${p.id}">Borrar</button>
    </footer>
  </article>`;
}

function campos() {
  return [
    { clave: 'nombre', etiqueta: 'Nombre', tipo: 'texto', requerido: true },
    { clave: 'rol', etiqueta: 'Qué hace', tipo: 'texto', placeholder: 'Ej: edición de video, community, diseño, programación' },
    { clave: 'contacto', etiqueta: 'Contacto', tipo: 'texto' },
    {
      clave: 'pagoFijo', etiqueta: 'Fijo mensual (si le pagás siempre lo mismo)', tipo: 'plata',
      ayuda: 'Dejalo vacío si le pagás por cliente. Eso se carga desde la ficha de cada cliente.',
    },
    { clave: 'notas', etiqueta: 'Notas', tipo: 'nota', placeholder: 'Cómo le pagás, cuándo, lo que sea.' },
  ];
}

async function crear() {
  const datos = await formulario({ titulo: 'Nueva persona', campos: campos() });
  if (!datos) return;
  mutar((s) => s.equipo.push({ id: id(), ...datos }));
  sincronizarMeses();
}

async function editar(e, personaId) {
  const p = e.equipo.find((x) => x.id === personaId);
  if (!p) return;
  const datos = await formulario({ titulo: `Editar ${p.nombre}`, campos: campos(), valores: p });
  if (!datos) return;

  mutar((s) => {
    const persona = s.equipo.find((x) => x.id === personaId);
    Object.assign(persona, datos);
    // Los pagos fijos todavía no hechos se actualizan al nuevo monto.
    s.movimientos.forEach((m) => {
      if ((m.origen || '').startsWith(`fijo:${personaId}:`) && m.estado === 'pendiente') {
        m.monto = datos.pagoFijo;
        m.concepto = `${datos.nombre} · fijo del mes`;
      }
    });
  });
  sincronizarMeses();
}

async function borrar(e, personaId) {
  const p = e.equipo.find((x) => x.id === personaId);
  if (!p) return;
  const ok = await confirmar(`¿Borrar a ${p.nombre}? Se van también sus pagos pendientes.`);
  if (!ok) return;

  mutar((s) => {
    s.equipo = s.equipo.filter((x) => x.id !== personaId);
    s.movimientos = s.movimientos.filter((m) => m.personaId !== personaId || m.estado === 'hecho');
    s.clientes.forEach((c) => {
      c.equipo = (c.equipo || []).filter((a) => a.personaId !== personaId);
    });
  });
}
