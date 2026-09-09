/* ═══════════════════════════════════════════════════════════
   AJUSTES — el dólar, los gastos que pagás todos los meses
   pase lo que pase, y la copia de seguridad.

   Lo de la copia no es un detalle: los datos viven en este
   aparato. Bajar la copia cada tanto es lo que hace que no se
   pierdan y lo que permite pasarlos de la compu al celular.
   ═══════════════════════════════════════════════════════════ */

import {
  mutar, id, cargar, reemplazarTodo, sincronizarMeses, mesLargo, mesDeHoy,
} from '../estado.js';
import { plata, texto, formulario, confirmar, vacio } from '../ui.js';

export default {
  ruta: 'ajustes',
  titulo: 'Ajustes',
  icono: '⚙',

  dibujar(e) {
    const gastos = e.ajustes.gastosFijos || [];
    const totalGastos = gastos.reduce(
      (t, g) => t + (g.moneda === 'USD' ? g.monto * e.ajustes.dolar : g.monto),
      0
    );

    return `
      <section class="bloque">
        <div class="bloque-cabeza"><h2 class="bloque-titulo">El dólar</h2></div>
        <p class="cuerpo-panel">Todo lo que cargues en dólares se convierte con este número para poder sumarlo con el resto. Actualizalo cuando se mueva.</p>
        <div class="fila">
          <div class="fila-texto"><strong>1 dólar = ${plata(e.ajustes.dolar)}</strong></div>
          <div class="fila-fin"><button class="btn btn-fantasma btn-chico" data-accion="editar-dolar">Cambiar</button></div>
        </div>
      </section>

      <section class="bloque">
        <div class="bloque-cabeza">
          <h2 class="bloque-titulo">Gastos fijos</h2>
          <span class="bloque-nota">${plata(totalGastos)} por mes</span>
          <button class="btn btn-lleno btn-chico" data-accion="nuevo-gasto">+ Gasto</button>
        </div>
        <p class="cuerpo-panel">Lo que pagás todos los meses tengas los clientes que tengas: herramientas, suscripciones, el contador, internet. Se descuentan solos de tu ganancia.</p>
        ${
          gastos.length
            ? `<ul class="lista">${gastos
                .map(
                  (g) => `<li class="fila">
                    <div class="fila-texto"><strong>${texto(g.concepto)}</strong></div>
                    <div class="fila-fin">
                      <span class="fila-monto negativo">${plata(g.monto, g.moneda)}</span>
                      <button class="icono-btn" data-accion="borrar-gasto" data-id="${g.id}" aria-label="Borrar">✕</button>
                    </div>
                  </li>`
                )
                .join('')}</ul>`
            : vacio('Todavía no cargaste ninguno.')
        }
      </section>

      <section class="bloque">
        <div class="bloque-cabeza"><h2 class="bloque-titulo">Tu copia de seguridad</h2></div>
        <p class="cuerpo-panel">
          Los datos de este panel viven en este aparato, no en internet. Nadie más los ve — pero si borrás el navegador, se van.
          Bajá la copia una vez por mes y guardala donde guardes las cosas importantes.
          Ese mismo archivo es el que subís en el celular para tener todo igual en los dos lados.
        </p>
        <div class="botonera">
          <button class="btn btn-lleno" data-accion="bajar-copia">Bajar copia</button>
          <button class="btn btn-fantasma" data-accion="subir-copia">Subir copia</button>
          <button class="btn btn-fantasma peligro" data-accion="borrar-todo">Borrar todo</button>
        </div>
        <p class="cuerpo-panel chico">
          Última copia: ${e.ajustes.ultimaCopia ? texto(e.ajustes.ultimaCopia) : 'nunca bajaste una'}.
        </p>
      </section>

      <section class="bloque">
        <div class="bloque-cabeza"><h2 class="bloque-titulo">El panel arranca en</h2></div>
        <p class="cuerpo-panel">
          Desde este mes en adelante el panel arma solo los cobros y los pagos. Si querés cargar meses anteriores para tener el historial, corré esta fecha para atrás.
        </p>
        <div class="fila">
          <div class="fila-texto"><strong>${mesLargo(e.ajustes.desde || mesDeHoy())}</strong></div>
          <div class="fila-fin"><button class="btn btn-fantasma btn-chico" data-accion="editar-desde">Cambiar</button></div>
        </div>
      </section>
    `;
  },

  async accion(nombre, datos, e) {
    if (nombre === 'editar-dolar') return editarDolar(e);
    if (nombre === 'editar-desde') return editarDesde(e);
    if (nombre === 'nuevo-gasto') return nuevoGasto();
    if (nombre === 'borrar-gasto') return borrarGasto(datos.id);
    if (nombre === 'bajar-copia') return bajarCopia();
    if (nombre === 'subir-copia') return subirCopia();
    if (nombre === 'borrar-todo') return borrarTodo();
  },
};

async function editarDolar(e) {
  const datos = await formulario({
    titulo: 'Cuánto vale el dólar',
    campos: [{ clave: 'dolar', etiqueta: 'Pesos por dólar', tipo: 'plata', requerido: true }],
    valores: { dolar: e.ajustes.dolar },
  });
  if (!datos) return;
  mutar((s) => {
    s.ajustes.dolar = datos.dolar;
  });
}

async function editarDesde(e) {
  const datos = await formulario({
    titulo: 'Desde qué mes',
    campos: [{ clave: 'desde', etiqueta: 'Primer mes del panel', tipo: 'fecha', requerido: true }],
    valores: { desde: `${e.ajustes.desde || mesDeHoy()}-01` },
    nota: 'Si lo corrés para atrás, el panel genera los cobros de esos meses con los clientes que tengas cargados hoy.',
  });
  if (!datos) return;
  mutar((s) => {
    s.ajustes.desde = datos.desde.slice(0, 7);
  });
  sincronizarMeses();
}

async function nuevoGasto() {
  const datos = await formulario({
    titulo: 'Nuevo gasto fijo',
    campos: [
      { clave: 'concepto', etiqueta: 'Qué es', tipo: 'texto', requerido: true, placeholder: 'Ej: Canva Pro, Meta Ads, contador' },
      { clave: 'monto', etiqueta: 'Cuánto por mes', tipo: 'plata', requerido: true },
      { clave: 'moneda', etiqueta: 'Moneda', tipo: 'opciones', opciones: [{ valor: 'ARS', nombre: 'Pesos' }, { valor: 'USD', nombre: 'Dólares' }] },
    ],
    valores: { moneda: 'ARS' },
  });
  if (!datos) return;
  mutar((s) => {
    s.ajustes.gastosFijos = s.ajustes.gastosFijos || [];
    s.ajustes.gastosFijos.push({ id: id(), ...datos });
  });
  sincronizarMeses();
}

function borrarGasto(gastoId) {
  mutar((s) => {
    s.ajustes.gastosFijos = (s.ajustes.gastosFijos || []).filter((g) => g.id !== gastoId);
    s.movimientos = s.movimientos.filter(
      (m) => !(m.origen || '').startsWith(`gasto:${gastoId}:`) || m.estado === 'hecho'
    );
  });
}

// ── Copia de seguridad ───────────────────────────────────────
function bajarCopia() {
  const e = cargar();
  const nombre = `naimid-panel-${new Date().toISOString().slice(0, 10)}.json`;
  const blob = new Blob([JSON.stringify(e, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);

  mutar((s) => {
    s.ajustes.ultimaCopia = new Date().toLocaleDateString('es-AR');
  });
}

function subirCopia() {
  const entrada = document.createElement('input');
  entrada.type = 'file';
  entrada.accept = 'application/json,.json';

  entrada.onchange = async () => {
    const archivo = entrada.files[0];
    if (!archivo) return;
    try {
      const datos = JSON.parse(await archivo.text());
      if (!datos || !Array.isArray(datos.clientes)) throw new Error('formato');
      const ok = await confirmar(
        `La copia trae ${datos.clientes.length} clientes y ${(datos.movimientos || []).length} movimientos.\n\nEsto reemplaza todo lo que tenés cargado ahora. ¿Seguimos?`
      );
      if (!ok) return;
      reemplazarTodo(datos);
      sincronizarMeses();
    } catch {
      window.alert('Ese archivo no es una copia del panel. Fijate que sea el .json que bajaste desde acá.');
    }
  };

  entrada.click();
}

async function borrarTodo() {
  const ok = await confirmar(
    'Esto borra TODO: clientes, equipo, movimientos, propuestas. No se puede deshacer.\n\n¿Bajaste la copia antes?'
  );
  if (!ok) return;
  const seguro = await confirmar('Última vez: ¿borro todo?');
  if (!seguro) return;
  reemplazarTodo({});
}
