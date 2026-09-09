/* ═══════════════════════════════════════════════════════════
   CLIENTES — quién te paga, cuánto, desde cuándo, y quién de
   tu equipo trabaja para cada uno.

   Esa última parte es la que hace que después el panel pueda
   decirte cuánto te deja cada cliente de verdad.
   ═══════════════════════════════════════════════════════════ */

import {
  mutar, id, SERVICIOS, nombreServicio, PLANES, mesDeHoy,
  distanciaMeses, mesDeFecha, sincronizarMeses, rentabilidadCliente,
  costoEquipoDeCliente, enPesos,
} from '../estado.js';
import { plata, fecha, texto, formulario, confirmar, chip, vacio } from '../ui.js';

const ESTADOS = [
  { valor: 'activo', nombre: 'Activo' },
  { valor: 'pausado', nombre: 'En pausa' },
  { valor: 'terminado', nombre: 'Terminado' },
  { valor: 'perdido', nombre: 'Se fue' },
];

const TONO_ESTADO = { activo: 'bien', pausado: 'aviso', terminado: '', perdido: 'mal' };

export default {
  ruta: 'clientes',
  titulo: 'Clientes',
  icono: '●',

  dibujar(e, ctx) {
    const { mes } = ctx;
    const orden = { activo: 0, pausado: 1, terminado: 2, perdido: 3 };
    const lista = [...e.clientes].sort(
      (a, b) => (orden[a.estado] ?? 9) - (orden[b.estado] ?? 9) || a.nombre.localeCompare(b.nombre)
    );

    if (!lista.length) {
      return `<section class="bloque">
        ${vacio(
          'Todavía no cargaste ningún cliente. Empezá por los que tenés activos hoy: nombre, qué le hacés y cuánto te paga por mes.',
          { accion: 'nuevo-cliente', texto: 'Cargar el primero' }
        )}
      </section>`;
    }

    const activos = lista.filter((c) => c.estado === 'activo');
    const mensual = activos.reduce(
      (t, c) => t + (c.tipo === 'mensual' ? enPesos(c.monto, c.moneda, e.ajustes.dolar) : 0),
      0
    );

    return `
      <section class="bloque">
        <div class="bloque-cabeza">
          <h2 class="bloque-titulo">${activos.length} ${activos.length === 1 ? 'cliente activo' : 'clientes activos'}</h2>
          <span class="bloque-nota">${plata(mensual)} por mes fijos</span>
          <button class="btn btn-lleno btn-chico" data-accion="nuevo-cliente">+ Cliente</button>
        </div>
        <div class="tarjetas">
          ${lista.map((c) => tarjeta(c, e, mes)).join('')}
        </div>
      </section>`;
  },

  async accion(nombre, datos, e, ctx) {
    if (nombre === 'nuevo-cliente') return crear(e);
    if (nombre === 'editar-cliente') return editar(e, datos.id);
    if (nombre === 'borrar-cliente') return borrar(e, datos.id);
    if (nombre === 'sumar-persona') return sumarPersona(e, datos.id);
    if (nombre === 'quitar-persona') return quitarPersona(datos.id, Number(datos.indice));
  },
};

// ── Una tarjeta por cliente ──────────────────────────────────
function tarjeta(c, e, mes) {
  const r = rentabilidadCliente(e, c, mes);
  const corridos = c.inicio ? distanciaMeses(mesDeFecha(c.inicio), mesDeHoy()) + 1 : 0;
  const costoEquipo = costoEquipoDeCliente(c, e.ajustes);

  const asignados = (c.equipo || []).map((a, i) => {
    const p = e.equipo.find((x) => x.id === a.personaId);
    if (!p) return '';
    const cuanto = a.modo === 'porcentaje' ? `${a.valor}%` : plata(a.valor);
    return `<li class="mini-fila">
      <span>${texto(p.nombre)} <em>${texto(p.rol || '')}</em></span>
      <span class="mini-fin">${cuanto}
        <button class="icono-btn" data-accion="quitar-persona" data-id="${c.id}" data-indice="${i}" aria-label="Quitar a ${texto(p.nombre)}">✕</button>
      </span>
    </li>`;
  }).join('');

  return `<article class="tarjeta">
    <header class="tarjeta-cabeza">
      <div>
        <h3>${texto(c.nombre)}</h3>
        <p class="tarjeta-bajada">${texto(nombreServicio(c.servicio))}${c.plan ? ` · ${texto(c.plan)}` : ''}</p>
      </div>
      ${chip(ESTADOS.find((x) => x.valor === c.estado)?.nombre || c.estado, TONO_ESTADO[c.estado])}
    </header>

    <dl class="datos">
      <div><dt>${c.tipo === 'mensual' ? 'Por mes' : 'Proyecto'}</dt><dd>${plata(c.monto, c.moneda)}</dd></div>
      <div><dt>Le pagás al equipo</dt><dd>${plata(costoEquipo)}</dd></div>
      <div><dt>Te queda</dt><dd class="${r.queda >= 0 ? 'positivo' : 'negativo'}">${plata(r.queda)}</dd></div>
      <div><dt>Cobra el</dt><dd>${c.tipo === 'mensual' ? `día ${c.diaCobro || 1}` : fecha(c.inicio)}</dd></div>
      ${corridos > 0 ? `<div><dt>Con vos hace</dt><dd>${corridos} ${corridos === 1 ? 'mes' : 'meses'}</dd></div>` : ''}
      ${c.contacto ? `<div><dt>Contacto</dt><dd>${texto(c.contacto)}</dd></div>` : ''}
    </dl>

    <div class="tarjeta-equipo">
      <span class="campo-titulo">Quién trabaja acá</span>
      ${asignados ? `<ul class="mini-lista">${asignados}</ul>` : '<p class="tarjeta-vacio">Nadie asignado todavía.</p>'}
      <button class="btn btn-fantasma btn-chico" data-accion="sumar-persona" data-id="${c.id}">+ Sumar a alguien</button>
    </div>

    ${c.notas ? `<p class="tarjeta-nota">${texto(c.notas)}</p>` : ''}

    <footer class="tarjeta-pie">
      <button class="btn btn-fantasma btn-chico" data-accion="editar-cliente" data-id="${c.id}">Editar</button>
      <button class="btn btn-fantasma btn-chico peligro" data-accion="borrar-cliente" data-id="${c.id}">Borrar</button>
    </footer>
  </article>`;
}

// ── El formulario ────────────────────────────────────────────
function campos() {
  return [
    { clave: 'nombre', etiqueta: 'Nombre de la marca', tipo: 'texto', requerido: true },
    { clave: 'contacto', etiqueta: 'Contacto', tipo: 'texto', placeholder: 'WhatsApp, mail o el nombre de quien te habla' },
    { clave: 'servicio', etiqueta: 'Qué le hacés', tipo: 'opciones', opciones: SERVICIOS.map((s) => ({ valor: s.valor, nombre: s.nombre })) },
    {
      clave: 'plan',
      etiqueta: 'Plan (solo si es manejo de redes)',
      tipo: 'opciones',
      opciones: [
        { valor: '', nombre: '— ninguno —' },
        ...Object.entries(PLANES).map(([nombre, p]) => ({
          valor: nombre,
          nombre: `${nombre} · ${p.posteos} posteos, ${p.historias} historias`,
        })),
      ],
      ayuda: 'De acá salen las entregas del mes: posteos, historias, jornadas de grabación y reporte.',
    },
    {
      clave: 'tipo', etiqueta: 'Cómo te paga', tipo: 'opciones',
      opciones: [{ valor: 'mensual', nombre: 'Todos los meses' }, { valor: 'unico', nombre: 'Una sola vez (proyecto)' }],
    },
    { clave: 'monto', etiqueta: 'Cuánto', tipo: 'plata', requerido: true },
    { clave: 'moneda', etiqueta: 'En qué moneda', tipo: 'opciones', opciones: [{ valor: 'ARS', nombre: 'Pesos' }, { valor: 'USD', nombre: 'Dólares' }] },
    { clave: 'diaCobro', etiqueta: 'Qué día del mes te paga', tipo: 'dia', valorInicial: 1, ayuda: 'Después de ese día, si no pagó, te aparece en rojo.' },
    { clave: 'inicio', etiqueta: 'Desde cuándo', tipo: 'fecha', requerido: true },
    { clave: 'estado', etiqueta: 'Estado', tipo: 'opciones', opciones: ESTADOS },
    { clave: 'notas', etiqueta: 'Notas', tipo: 'nota', placeholder: 'Lo que no quieras olvidarte de esta marca.' },
  ];
}

async function crear(e) {
  const datos = await formulario({
    titulo: 'Nuevo cliente',
    campos: campos(),
    valores: { tipo: 'mensual', moneda: 'ARS', estado: 'activo', diaCobro: 1, inicio: new Date().toISOString().slice(0, 10) },
    nota: 'Con esto el panel ya te arma solo el cobro de cada mes y la lista de lo que hay que entregarle.',
  });
  if (!datos) return;

  mutar((s) => {
    s.clientes.push({ id: id(), equipo: [], ...datos, plan: datos.plan || null });
  });
  sincronizarMeses();
}

async function editar(e, clienteId) {
  const actual = e.clientes.find((c) => c.id === clienteId);
  if (!actual) return;

  const datos = await formulario({ titulo: `Editar ${actual.nombre}`, campos: campos(), valores: actual });
  if (!datos) return;

  mutar((s) => {
    const c = s.clientes.find((x) => x.id === clienteId);
    Object.assign(c, datos, { plan: datos.plan || null });

    // Si cambió el precio, se corrigen los cobros de este mes en
    // adelante que todavía no se cobraron. Los meses ya cerrados
    // quedan como fueron: son historia, no se toca.
    const hoy = mesDeHoy();
    s.movimientos.forEach((m) => {
      if (m.tipo !== 'cobro' || m.clienteId !== clienteId) return;
      if (m.estado === 'hecho' || distanciaMeses(hoy, m.mes) < 0) return;
      m.monto = c.monto;
      m.moneda = c.moneda;
      m.concepto = c.plan ? `${c.nombre} · ${c.plan}` : c.nombre;
    });
  });
  sincronizarMeses();
}

async function borrar(e, clienteId) {
  const c = e.clientes.find((x) => x.id === clienteId);
  if (!c) return;
  const ok = await confirmar(
    `¿Borrar a ${c.nombre} y todo su historial de cobros?\n\nSi solo dejó de trabajar con vos, mejor editalo y ponelo en "Se fue": así los números de los meses viejos siguen siendo ciertos.`
  );
  if (!ok) return;

  mutar((s) => {
    s.clientes = s.clientes.filter((x) => x.id !== clienteId);
    s.movimientos = s.movimientos.filter((m) => m.clienteId !== clienteId);
    Object.keys(s.entregas)
      .filter((k) => k.startsWith(`${clienteId}|`))
      .forEach((k) => delete s.entregas[k]);
  });
}

async function sumarPersona(e, clienteId) {
  if (!e.equipo.length) {
    window.alert('Primero cargá a tu gente en la sección Equipo.');
    return;
  }
  const datos = await formulario({
    titulo: 'Sumar a alguien a este cliente',
    campos: [
      { clave: 'personaId', etiqueta: 'Quién', tipo: 'opciones', opciones: e.equipo.map((p) => ({ valor: p.id, nombre: `${p.nombre}${p.rol ? ` · ${p.rol}` : ''}` })) },
      {
        clave: 'modo', etiqueta: 'Cómo le pagás por este cliente', tipo: 'opciones',
        opciones: [{ valor: 'fijo', nombre: 'Un monto fijo por mes' }, { valor: 'porcentaje', nombre: 'Un porcentaje de lo que paga el cliente' }],
      },
      { clave: 'valor', etiqueta: 'Cuánto (monto en pesos, o el número del porcentaje)', tipo: 'numero', requerido: true },
    ],
    valores: { modo: 'fijo' },
    nota: 'Esto se suma solo a "tenés que pagar" todos los meses mientras el cliente esté activo.',
  });
  if (!datos) return;

  mutar((s) => {
    const c = s.clientes.find((x) => x.id === clienteId);
    c.equipo = c.equipo || [];
    c.equipo.push(datos);
  });
  sincronizarMeses();
}

function quitarPersona(clienteId, indice) {
  mutar((s) => {
    const c = s.clientes.find((x) => x.id === clienteId);
    if (!c || !c.equipo) return;
    c.equipo.splice(indice, 1);
    // Se van también los pagos pendientes que generaba esa asignación.
    s.movimientos = s.movimientos.filter(
      (m) => !(m.origen || '').startsWith(`equipo:${clienteId}:`) || m.estado === 'hecho'
    );
  });
  sincronizarMeses();
}
