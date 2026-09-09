/* ═══════════════════════════════════════════════════════════
   PIEZAS SUELTAS — formato de números y el formulario que se
   abre en ventanita. Todas las vistas usan esto.
   ═══════════════════════════════════════════════════════════ */

const PESOS = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

const DOLARES = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function plata(monto, moneda = 'ARS') {
  const n = Math.round(monto || 0);
  return moneda === 'USD' ? DOLARES.format(n) : PESOS.format(n);
}

/** Versión corta para las tarjetas grandes: $1,4 M en vez de $1.400.000 */
export function plataCorta(monto) {
  const n = Math.round(monto || 0);
  const signo = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (a >= 1_000_000) return `${signo}$${(a / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1).replace('.', ',')} M`;
  if (a >= 1_000) return `${signo}$${Math.round(a / 1000)} mil`;
  return `${signo}$${a}`;
}

export function fecha(iso) {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a.slice(2)}`;
}

/** Escapa lo que escribe el usuario antes de meterlo en el HTML. */
export function texto(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ═══════════════════════════════════════════════════════════
// VENTANITA CON FORMULARIO
//
// Se describe con una lista de campos y devuelve una promesa
// con lo que se cargó, o null si se cerró sin guardar.
//
//   const datos = await formulario({
//     titulo: 'Nuevo cliente',
//     campos: [{ clave:'nombre', etiqueta:'Nombre', tipo:'texto', requerido:true }],
//     valores: clienteExistente,
//   });
// ═══════════════════════════════════════════════════════════

export function formulario({ titulo, campos, valores = {}, textoBoton = 'Guardar', nota }) {
  return new Promise((resolver) => {
    const fondo = document.createElement('div');
    fondo.className = 'ventana-fondo';
    fondo.innerHTML = `
      <div class="ventana" role="dialog" aria-modal="true" aria-label="${texto(titulo)}">
        <header class="ventana-cabeza">
          <h2>${texto(titulo)}</h2>
          <button type="button" class="ventana-cerrar" aria-label="Cerrar">✕</button>
        </header>
        <form class="ventana-cuerpo" novalidate>
          ${campos.map((c) => campoHTML(c, valores[c.clave])).join('')}
          ${nota ? `<p class="ventana-nota">${texto(nota)}</p>` : ''}
          <div class="ventana-pie">
            <button type="button" class="btn btn-fantasma" data-cancelar>Cancelar</button>
            <button type="submit" class="btn btn-lleno">${texto(textoBoton)}</button>
          </div>
        </form>
      </div>`;

    const cerrar = (resultado) => {
      document.removeEventListener('keydown', alTeclado);
      fondo.remove();
      resolver(resultado);
    };
    const alTeclado = (ev) => ev.key === 'Escape' && cerrar(null);

    fondo.querySelector('.ventana-cerrar').onclick = () => cerrar(null);
    fondo.querySelector('[data-cancelar]').onclick = () => cerrar(null);
    fondo.onclick = (ev) => ev.target === fondo && cerrar(null);
    document.addEventListener('keydown', alTeclado);

    fondo.querySelector('form').onsubmit = (ev) => {
      ev.preventDefault();
      const datos = {};
      let falta = null;

      campos.forEach((c) => {
        const el = fondo.querySelector(`[name="${c.clave}"]`);
        if (!el) return;
        let v = el.type === 'checkbox' ? el.checked : el.value;
        if (c.tipo === 'numero' || c.tipo === 'plata') v = v === '' ? null : Number(v);
        if (c.requerido && (v === '' || v === null || v === undefined)) falta = falta || el;
        datos[c.clave] = v;
      });

      if (falta) {
        falta.focus();
        falta.classList.add('campo-falta');
        return;
      }
      cerrar(datos);
    };

    document.body.appendChild(fondo);
    const primero = fondo.querySelector('input, select, textarea');
    if (primero) primero.focus();
  });
}

function campoHTML(c, valor) {
  const v = valor ?? c.valorInicial ?? '';
  const ayuda = c.ayuda ? `<span class="campo-ayuda">${texto(c.ayuda)}</span>` : '';
  const etiqueta = `<span class="campo-titulo">${texto(c.etiqueta)}</span>${ayuda}`;

  if (c.tipo === 'opciones') {
    return `<label class="campo">${etiqueta}
      <select name="${c.clave}">
        ${c.opciones
          .map(
            (o) =>
              `<option value="${texto(o.valor)}"${String(o.valor) === String(v) ? ' selected' : ''}>${texto(o.nombre)}</option>`
          )
          .join('')}
      </select></label>`;
  }

  if (c.tipo === 'nota') {
    return `<label class="campo">${etiqueta}
      <textarea name="${c.clave}" rows="3" placeholder="${texto(c.placeholder || '')}">${texto(v)}</textarea></label>`;
  }

  const tipos = { texto: 'text', numero: 'number', plata: 'number', fecha: 'date', dia: 'number' };
  const paso = c.tipo === 'plata' ? ' step="1000" min="0" inputmode="numeric"' : '';
  const rango = c.tipo === 'dia' ? ' min="1" max="31" inputmode="numeric"' : '';

  return `<label class="campo">${etiqueta}
    <input type="${tipos[c.tipo] || 'text'}" name="${c.clave}" value="${texto(v)}"
      placeholder="${texto(c.placeholder || '')}"${paso}${rango} /></label>`;
}

/** Confirmación sencilla para lo que no tiene vuelta atrás. */
export function confirmar(mensaje) {
  return Promise.resolve(window.confirm(mensaje));
}

// ═══════════════════════════════════════════════════════════
// TROZOS DE PANTALLA QUE SE REPITEN
// ═══════════════════════════════════════════════════════════

export function tarjetaNumero({ etiqueta, valor, detalle, tono = '' }) {
  return `<div class="numero ${tono}">
    <span class="numero-etiqueta">${texto(etiqueta)}</span>
    <strong class="numero-valor">${texto(valor)}</strong>
    ${detalle ? `<span class="numero-detalle">${texto(detalle)}</span>` : ''}
  </div>`;
}

export function vacio(mensaje, boton) {
  return `<div class="vacio">
    <p>${texto(mensaje)}</p>
    ${boton ? `<button class="btn btn-lleno" data-accion="${texto(boton.accion)}">${texto(boton.texto)}</button>` : ''}
  </div>`;
}

export function chip(textoChip, tono = '') {
  return `<span class="chip ${tono}">${texto(textoChip)}</span>`;
}
