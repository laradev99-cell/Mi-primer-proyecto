/* ═══════════════════════════════════════════════════════════
   EL PANEL — arma la pantalla, escucha los clics y decide qué
   vista mostrar. Cada sección vive en su propio archivo dentro
   de vistas/ y solo devuelve HTML.
   ═══════════════════════════════════════════════════════════ */

import {
  cargar, alCambiar, sincronizarMeses, mesDeHoy, mesLargo, correrMes, distanciaMeses,
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
alCambiar(() => {});

// ═══════════════════════════════════════════════════════════
// ARRANQUE
// ═══════════════════════════════════════════════════════════

cargar();
sincronizarMeses();
dibujar();

// La app instalada en el celular: se guarda para andar sin señal.
// Solo cuando corre en su dirección real: empaquetado suelto no hay
// service worker que registrar.
if ('serviceWorker' in navigator && location.pathname.startsWith('/panel')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Sin service worker el panel funciona igual, solo que
      // necesita conexión la primera vez de cada día.
    });
  });
}
