/* ═══════════════════════════════════════════════════════════
   EL PANEL — arma la pantalla, escucha los clics y decide qué
   vista mostrar. Cada sección vive en su propio archivo dentro
   de vistas/ y solo devuelve HTML.
   ═══════════════════════════════════════════════════════════ */

import {
  cargar, iniciar, errorDeConexion, alCambiar, sincronizarMeses,
  mesDeHoy, mesLargo, correrMes, distanciaMeses,
} from './estado.js';

import resumen from './vistas/resumen.js';
import clientes from './vistas/clientes.js';
import plata from './vistas/plata.js';
import equipo from './vistas/equipo.js';
import trabajo from './vistas/trabajo.js';
import propuestas from './vistas/propuestas.js';
import ajustes from './vistas/ajustes.js';

const VISTAS = [resumen, plata, clientes, equipo, trabajo, propuestas, ajustes];

// El mes que se está mirando. Todas las vistas leen de acá.
const ctx = {
  mes: mesDeHoy(),
  irAlMes(mes) {
    ctx.mes = mes;
    dibujar();
  },
};

function vistaActual() {
  const ruta = location.hash.replace('#/', '') || 'resumen';
  return VISTAS.find((v) => v.ruta === ruta) || VISTAS[0];
}

// ═══════════════════════════════════════════════════════════
// DIBUJAR
// ═══════════════════════════════════════════════════════════

const raiz = document.querySelector('#panel');

// La clase la pone el layout de Astro, pero el panel también se
// empaqueta suelto en un solo HTML (ver inline.cjs) y ahí el <body>
// llega pelado. Ponerla acá hace que el fondo y el scroll anden en
// los dos casos.
document.body.classList.add('panel-body');

function dibujar() {
  const problema = errorDeConexion();
  if (problema) {
    raiz.innerHTML = avisoDeConexion(problema);
    return;
  }

  const e = cargar();
  const vista = vistaActual();

  raiz.innerHTML = `
    ${barraSuperior(e, vista)}
    <main class="contenido" id="contenido">
      ${e.clientes.length === 0 && vista.ruta === 'resumen' ? primerosPasos() : ''}
      ${vista.dibujar(e, ctx)}
    </main>
    ${navegacion(vista)}
  `;
  raiz.querySelector('.contenido').scrollTop = 0;
}

// Sin conexión con la base no hay nada seguro que mostrar: mejor
// avisar claro que dejar que cargue datos y arriesgarse a que no
// se guarde nada de lo que ella escriba.
const MENSAJE_ERROR = {
  'sin-base': 'Este panel necesita abrirse desde tu link de Claude. Si lo abriste desde ahí, esperá unos segundos — se está por conectar solo.',
  revoked: 'Se perdió el acceso a tus datos. Cerrá esta pestaña y volvé a abrir el panel desde tu link.',
  not_granted: 'No se pudo conectar con tus datos. Cerrá esta pestaña y volvé a abrir el panel desde tu link.',
};

function avisoDeConexion(codigo) {
  const mensaje =
    MENSAJE_ERROR[codigo] ||
    'No se pudo conectar con la nube en este momento. Esperá un momento y volvé a intentar.';

  return `<div class="pantalla-error">
    <div class="pantalla-error-caja">
      <span class="barra-punto"></span>
      <h1>No se pudo conectar</h1>
      <p>${mensaje}</p>
      <button class="btn btn-lleno" onclick="location.reload()">Reintentar</button>
    </div>
  </div>`;
}

function barraSuperior(e, vista) {
  // El mes no se elige en las secciones que no dependen del mes.
  const conMes = ['resumen', 'plata', 'trabajo'].includes(vista.ruta);
  const distancia = distanciaMeses(ctx.mes, mesDeHoy());

  return `<header class="barra">
    <div class="barra-marca">
      <span class="barra-punto"></span>
      <span>${vista.titulo}</span>
    </div>
    ${
      conMes
        ? `<div class="selector-mes">
            <button class="icono-btn" data-mes="atras" aria-label="Mes anterior">‹</button>
            <span class="selector-texto">${mesLargo(ctx.mes)}</span>
            <button class="icono-btn" data-mes="adelante" aria-label="Mes siguiente" ${distancia <= 0 ? 'disabled' : ''}>›</button>
            ${distancia !== 0 ? '<button class="btn btn-chico btn-fantasma" data-mes="hoy">Hoy</button>' : ''}
          </div>`
        : ''
    }
  </header>`;
}

function navegacion(vista) {
  return `<nav class="nav" aria-label="Secciones del panel">
    ${VISTAS.map(
      (v) => `<a class="nav-item${v.ruta === vista.ruta ? ' activo' : ''}" href="#/${v.ruta}">
        <span class="nav-icono" aria-hidden="true">${v.icono}</span>
        <span class="nav-texto">${v.titulo}</span>
      </a>`
    ).join('')}
  </nav>`;
}

// Se muestra una sola vez: cuando el panel está vacío.
function primerosPasos() {
  return `<section class="bloque guia">
    <div class="bloque-cabeza"><h2 class="bloque-titulo">Por dónde empezar</h2></div>
    <p class="cuerpo-panel">Media hora una sola vez y el panel se ocupa del resto todos los meses.</p>
    <ol class="pasos">
      <li><strong>Tu equipo.</strong> Las cinco personas: nombre, qué hace y, si le pagás siempre lo mismo, cuánto.</li>
      <li><strong>Tus clientes activos.</strong> Nombre, qué le hacés, cuánto te paga, qué día y desde cuándo.</li>
      <li><strong>Quién trabaja en cada cliente.</strong> Desde la ficha del cliente, sumás a la persona y cuánto cobra por ese trabajo. Esto es lo que después te dice cuánto te queda a vos.</li>
      <li><strong>Tus gastos fijos.</strong> En Ajustes: lo que pagás todos los meses pase lo que pase.</li>
    </ol>
    <p class="cuerpo-panel">Desde ahí, cada mes ya vas a tener armados los cobros, los pagos y la lista de lo que hay que entregar. Vos solo marcás.</p>
    <div class="botonera">
      <a class="btn btn-lleno" href="#/equipo">Arrancar por el equipo</a>
      <a class="btn btn-fantasma" href="#/clientes">O por los clientes</a>
    </div>
  </section>`;
}

// ═══════════════════════════════════════════════════════════
// ESCUCHAR
// Un solo oyente para todo: cada botón dice qué hace con
// data-accion y la vista actual resuelve.
// ═══════════════════════════════════════════════════════════

async function despachar(nombre, datos) {
  const vista = vistaActual();
  if (!vista.accion) return;
  await vista.accion(nombre, datos, cargar(), ctx);
  dibujar();
}

document.addEventListener('click', (ev) => {
  const mes = ev.target.closest('[data-mes]');
  if (mes) {
    const paso = mes.dataset.mes;
    ctx.mes = paso === 'hoy' ? mesDeHoy() : correrMes(ctx.mes, paso === 'atras' ? -1 : 1);
    dibujar();
    return;
  }

  const boton = ev.target.closest('[data-accion]');
  if (!boton || boton.tagName === 'SELECT') return;
  despachar(boton.dataset.accion, { ...boton.dataset });
});

// Los desplegables (mover una propuesta de etapa) avisan al cambiar.
document.addEventListener('change', (ev) => {
  const select = ev.target.closest('select[data-accion]');
  if (!select) return;
  despachar(select.dataset.accion, { ...select.dataset, valor: select.value });
});

window.addEventListener('hashchange', dibujar);

// De acá en más, cualquier cambio en la base —el tuyo desde otra
// pestaña, o el de otro aparato con este mismo panel abierto—
// redibuja la pantalla sola.
alCambiar(dibujar);

// ═══════════════════════════════════════════════════════════
// ARRANQUE
//
// Primero se conecta con la base y espera la foto real de tus
// datos. Recién ahí corre el armado del mes: si lo hiciera antes,
// trabajaría sobre una foto vacía que la foto real, al llegar,
// pisaría entera.
// ═══════════════════════════════════════════════════════════

iniciar().then(() => {
  if (!errorDeConexion()) sincronizarMeses();
  dibujar();
});
