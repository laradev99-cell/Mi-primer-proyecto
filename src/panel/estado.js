/* ═══════════════════════════════════════════════════════════
   EL ESTADO — todo lo que el panel sabe de tu negocio.

   Los datos viven en la nube, en la base propia de este panel —
   no en este navegador ni en este aparato. Por eso da lo mismo
   abrirlo desde el celular o desde la compu: es el mismo lugar,
   siempre al día. Solo vos podés leerlo o escribirlo: el panel
   se publica con el acceso restringido al dueño de la cuenta
   (ver las `rules` al declarar la capacidad `db`).
   ═══════════════════════════════════════════════════════════ */

// Toda la información vive en un único documento. Alcanza de
// sobra para un negocio de este tamaño — hasta varios miles de
// movimientos entran cómodos en el límite de 256 KB por
// documento. Si algún día se acerca a ese límite, el camino es
// partir `movimientos` y `entregas` en un documento por año;
// ninguna pantalla tendría que cambiar para eso, solo esta capa.
const RUTA = 'negocio/datos';

// ── Forma de los datos ───────────────────────────────────────
// clientes[]    quién te paga, cuánto y desde cuándo
// equipo[]      a quién le pagás vos
// movimientos[] el libro de plata: cada cobro, cada pago
// entregas{}    qué hay que hacer cada mes por cada cliente
// propuestas[]  lo que todavía no es cliente
// ajustes       dólar, gastos fijos, arranque
function estadoVacio() {
  return {
    version: 1,
    ajustes: {
      dolar: 1400,
      gastosFijos: [],
      // Orígenes que ella borró a mano y no se regeneran.
      borrados: [],
      // Desde qué mes el panel genera cobros solo.
      // Se fija la primera vez que se abre.
      desde: mesDeHoy(),
    },
    clientes: [],
    equipo: [],
    movimientos: [],
    entregas: {},
    propuestas: [],
  };
}

// ═══════════════════════════════════════════════════════════
// FECHAS — el mes se escribe siempre 'AAAA-MM'
// ═══════════════════════════════════════════════════════════

export function mesDeHoy() {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
}

export function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

export function mesDeFecha(iso) {
  return (iso || '').slice(0, 7);
}

/** Suma (o resta) meses a un 'AAAA-MM'. */
export function correrMes(mes, cantidad) {
  const [a, m] = mes.split('-').map(Number);
  const d = new Date(a, m - 1 + cantidad, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Cuántos meses hay entre dos meses. Negativo si el segundo es anterior. */
export function distanciaMeses(desde, hasta) {
  const [a1, m1] = desde.split('-').map(Number);
  const [a2, m2] = hasta.split('-').map(Number);
  return (a2 - a1) * 12 + (m2 - m1);
}

const NOMBRES_MES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function mesLargo(mes) {
  const [a, m] = mes.split('-').map(Number);
  const nombre = NOMBRES_MES[m - 1];
  return `${nombre[0].toUpperCase()}${nombre.slice(1)} ${a}`;
}

/** El día `dia` del mes `mes`, sin pasarse del último día. */
export function fechaEnMes(mes, dia) {
  const [a, m] = mes.split('-').map(Number);
  const ultimo = new Date(a, m, 0).getDate();
  const d = Math.min(Math.max(dia || 1, 1), ultimo);
  return `${mes}-${String(d).padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════
// GUARDAR Y LEER — la base del panel (capacidad `db`)
//
// `cargar()` es siempre sincrónica: devuelve la última foto
// conocida, sin esperar a nadie. La conexión con la base corre
// aparte, en `iniciar()`, y va actualizando esa foto sola.
// ═══════════════════════════════════════════════════════════

let bd = null; // el espacio de la base una vez conectado, o null si no hay
let estado = estadoVacio();
let listo = false; // ya llegó la primera foto real (o se confirmó que no hay base)
let error = null; // null, 'sin-base', o el código de error de la base
const oyentes = new Set();

/** Rellena lo que un documento viejo no traiga todavía, sin
    perder lo que sí trae — así una sección nueva del panel no
    rompe la lectura de datos guardados antes de que existiera. */
function completar(datos) {
  const base = estadoVacio();
  return {
    ...base,
    ...datos,
    ajustes: { ...base.ajustes, ...(datos.ajustes || {}) },
  };
}

/** Conecta con la base y espera la primera foto. Se llama una
    sola vez, al arrancar el panel. De ahí en más, cualquier
    cambio —tuyo o de otro aparato con este mismo panel abierto—
    llega solo y avisa a `alCambiar`. */
export function iniciar() {
  return new Promise((resolver) => {
    (async () => {
      const claude = typeof window !== 'undefined' ? window.claude : null;
      bd = claude ? await claude.use('db') : null;

      if (!bd) {
        error = 'sin-base';
        listo = true;
        resolver();
        return;
      }

      let primera = true;
      bd.doc(RUTA).onSnapshot(
        (foto) => {
          error = null;
          estado = foto.exists ? completar(foto.data()) : estadoVacio();
          listo = true;
          if (primera) {
            primera = false;
            resolver();
          } else {
            notificar();
          }
        },
        (err) => {
          error = err.code;
          listo = true;
          if (primera) {
            primera = false;
            resolver();
          } else {
            notificar();
          }
        }
      );
    })();
  });
}

export function cargar() {
  return estado;
}

export function estaListo() {
  return listo;
}

/** null si está todo bien; si no, el motivo por el que el panel
    no puede guardar — para mostrarlo en pantalla en vez de dejar
    que ella seleccione y no se guarde nada. */
export function errorDeConexion() {
  return error;
}

function notificar() {
  oyentes.forEach((fn) => fn(estado));
}

export function alCambiar(fn) {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

// Las escrituras a un mismo documento van de a una: si dos
// acciones mutan casi juntas, la segunda espera a que la base
// termine de guardar la primera antes de mandar la suya.
let colaEscritura = Promise.resolve();

function guardar(copia) {
  if (!bd) return;
  colaEscritura = colaEscritura
    .catch(() => {})
    .then(() => bd.doc(RUTA).set(JSON.parse(JSON.stringify(copia))))
    .catch(() => {
      // Se reintenta sola: la próxima mutación manda el estado
      // completo de nuevo, así que no hace falta guardar cuál
      // escritura puntual falló.
    });
}

/** Cambia los datos y avisa a la pantalla. Todo pasa por acá.
    La pantalla se actualiza al toque; la base se pone al día en
    segundo plano, sin que las vistas tengan que esperarla. */
export function mutar(cambio) {
  const copia = JSON.parse(JSON.stringify(estado));
  cambio(copia);
  estado = copia;
  notificar();
  guardar(copia);
}

export function reemplazarTodo(nuevo) {
  mutar((s) => {
    Object.keys(s).forEach((clave) => delete s[clave]);
    Object.assign(s, estadoVacio(), nuevo);
  });
}

export function id() {
  return Math.random().toString(36).slice(2, 10);
}

// ═══════════════════════════════════════════════════════════
// PLATA — todo se compara en pesos
// ═══════════════════════════════════════════════════════════

export function enPesos(monto, moneda, dolar) {
  return moneda === 'USD' ? (monto || 0) * (dolar || 0) : monto || 0;
}

/** Lo que vale un movimiento en pesos, con el dólar de Ajustes. */
export function pesosDe(mov, ajustes) {
  return enPesos(mov.monto, mov.moneda, ajustes.dolar);
}

// ═══════════════════════════════════════════════════════════
// PLANES — de acá salen las entregas del mes y el precio
// sugerido. Los volúmenes y los precios son los del documento
// de costos de septiembre 2026.
//
// El escalón de posteos es parejo a propósito: 4 → 7 → 10.
// ═══════════════════════════════════════════════════════════

export const PLANES = {
  ESENCIAL: {
    precio: 860000,
    posteos: 4,
    historias: 10,
    jornadas: 1,
    reporte: false,
    facebook: false,
  },
  PRESENCIA: {
    precio: 1270000,
    posteos: 7,
    historias: 18,
    jornadas: 2,
    reporte: false,
    facebook: false,
  },
  CRECIMIENTO: {
    precio: 1780000,
    posteos: 10,
    historias: 26,
    jornadas: 3,
    reporte: true,
    facebook: true,
  },
};

export const SERVICIOS = [
  { valor: 'redes', nombre: 'Manejo de redes' },
  { valor: 'estrategia', nombre: 'Análisis y estrategia' },
  { valor: 'web', nombre: 'Página web / tienda' },
  { valor: 'vendedor', nombre: 'El vendedor que nunca duerme' },
  { valor: 'otro', nombre: 'Otro' },
];

export function nombreServicio(valor) {
  return (SERVICIOS.find((s) => s.valor === valor) || {}).nombre || 'Otro';
}

/** La lista de tareas que le corresponde a un cliente en un mes. */
function plantillaEntregas(cliente) {
  if (cliente.servicio !== 'redes') {
    return [
      { clave: 'avance', texto: 'Avance del proyecto', tipo: 'check' },
      { clave: 'entrega', texto: 'Entregado al cliente', tipo: 'check' },
    ];
  }
  const plan = PLANES[cliente.plan] || PLANES.ESENCIAL;
  const items = [
    { clave: 'ideas', texto: 'Ideas de contenido aprobadas', tipo: 'check' },
    { clave: 'jornadas', texto: 'Jornadas de grabación', tipo: 'cuenta', meta: plan.jornadas },
    { clave: 'posteos', texto: 'Posteos', tipo: 'cuenta', meta: plan.posteos },
    { clave: 'historias', texto: 'Historias', tipo: 'cuenta', meta: plan.historias },
  ];
  if (plan.facebook) items.push({ clave: 'facebook', texto: 'Publicado también en Facebook', tipo: 'check' });
  if (plan.reporte) items.push({ clave: 'reporte', texto: 'Reporte mensual', tipo: 'check' });
  return items;
}

export function claveEntrega(clienteId, mes) {
  return `${clienteId}|${mes}`;
}

// ═══════════════════════════════════════════════════════════
// EL MES SE ARMA SOLO
//
// Esto es lo que resuelve el "no sé cuándo arranca un mes con
// un cliente": cada vez que se abre el panel, para cada mes
// desde el arranque hasta hoy se crean —una sola vez— el cobro
// que corresponde, los pagos al equipo y los gastos fijos.
// Todo queda en "pendiente" hasta que vos lo marcás.
//
// El campo `origen` es la marca que evita duplicados: si ya
// existe un movimiento con ese origen, no se vuelve a crear.
// ═══════════════════════════════════════════════════════════

/** ¿Ese cliente está activo y facturando en ese mes? */
export function clienteActivoEn(cliente, mes) {
  if (cliente.tipo !== 'mensual') return false;
  if (cliente.estado !== 'activo') return false;
  const inicio = mesDeFecha(cliente.inicio) || mes;
  if (distanciaMeses(inicio, mes) < 0) return false;
  if (cliente.fin && distanciaMeses(mesDeFecha(cliente.fin), mes) > 0) return false;
  return true;
}

/** Lo que le pagás al equipo por un cliente, en pesos.
    Los montos fijos del equipo se cargan siempre en pesos; el
    porcentaje se calcula sobre lo que paga el cliente. */
export function costoEquipoDeCliente(cliente, ajustes) {
  return (cliente.equipo || []).reduce((total, asignado) => {
    if (asignado.modo === 'porcentaje') {
      return total + enPesos(cliente.monto, cliente.moneda, ajustes.dolar) * (asignado.valor / 100);
    }
    return total + (asignado.valor || 0);
  }, 0);
}

export function sincronizarMeses() {
  mutar((e) => {
    const hasta = mesDeHoy();
    const desde = e.ajustes.desde || hasta;
    // Lo ya creado, más lo que ella borró a mano: si sacó un cobro
    // automático fue a propósito, así que no vuelve a aparecer.
    const existentes = new Set(e.movimientos.map((m) => m.origen).filter(Boolean));
    (e.ajustes.borrados || []).forEach((og) => existentes.add(og));

    for (let mes = desde; distanciaMeses(mes, hasta) >= 0; mes = correrMes(mes, 1)) {
      // ── Cobros de clientes mensuales ──
      e.clientes.forEach((c) => {
        if (!clienteActivoEn(c, mes)) return;

        const origen = `cobro:${c.id}:${mes}`;
        if (!existentes.has(origen)) {
          e.movimientos.push({
            id: id(),
            origen,
            tipo: 'cobro',
            mes,
            fecha: fechaEnMes(mes, c.diaCobro || 1),
            clienteId: c.id,
            concepto: c.plan ? `${c.nombre} · ${c.plan}` : c.nombre,
            monto: c.monto,
            moneda: c.moneda || 'ARS',
            estado: 'pendiente',
          });
          existentes.add(origen);
        }

        // ── Lo que le pagás al equipo por ese cliente ──
        // Una asignación por persona y cliente: el `origen` no lleva
        // índice para que sacar a alguien no descoloque a los demás.
        (c.equipo || []).forEach((asignado) => {
          const persona = e.equipo.find((p) => p.id === asignado.personaId);
          if (!persona) return;
          const og = `equipo:${c.id}:${asignado.personaId}:${mes}`;
          if (existentes.has(og)) return;
          const monto =
            asignado.modo === 'porcentaje'
              ? Math.round(enPesos(c.monto, c.moneda, e.ajustes.dolar) * (asignado.valor / 100))
              : asignado.valor;
          e.movimientos.push({
            id: id(),
            origen: og,
            tipo: 'pago',
            mes,
            fecha: fechaEnMes(mes, 5),
            clienteId: c.id,
            personaId: persona.id,
            concepto: `${persona.nombre} · ${c.nombre}`,
            monto,
            moneda: 'ARS',
            estado: 'pendiente',
          });
          existentes.add(og);
        });

        // ── Las entregas del mes ──
        const clave = claveEntrega(c.id, mes);
        if (!e.entregas[clave]) {
          e.entregas[clave] = plantillaEntregas(c).map((t) => ({
            ...t,
            hecho: false,
            hechos: 0,
          }));
        }
      });

      // ── Sueldos fijos del equipo (no dependen de un cliente) ──
      e.equipo.forEach((p) => {
        if (!p.pagoFijo) return;
        const og = `fijo:${p.id}:${mes}`;
        if (existentes.has(og)) return;
        e.movimientos.push({
          id: id(),
          origen: og,
          tipo: 'pago',
          mes,
          fecha: fechaEnMes(mes, 5),
          personaId: p.id,
          concepto: `${p.nombre} · fijo del mes`,
          monto: p.pagoFijo,
          moneda: 'ARS',
          estado: 'pendiente',
        });
        existentes.add(og);
      });

      // ── Gastos fijos tuyos ──
      (e.ajustes.gastosFijos || []).forEach((g) => {
        const og = `gasto:${g.id}:${mes}`;
        if (existentes.has(og)) return;
        e.movimientos.push({
          id: id(),
          origen: og,
          tipo: 'gasto',
          mes,
          fecha: fechaEnMes(mes, 1),
          concepto: g.concepto,
          monto: g.monto,
          moneda: g.moneda || 'ARS',
          estado: 'pendiente',
        });
        existentes.add(og);
      });
    }
  });
}

// ═══════════════════════════════════════════════════════════
// LOS NÚMEROS DEL MES
// ═══════════════════════════════════════════════════════════

export function resumenDelMes(e, mes) {
  const delMes = e.movimientos.filter((m) => m.mes === mes);
  const suma = (lista) => lista.reduce((t, m) => t + pesosDe(m, e.ajustes), 0);

  const cobros = delMes.filter((m) => m.tipo === 'cobro');
  const pagos = delMes.filter((m) => m.tipo === 'pago');
  const gastos = delMes.filter((m) => m.tipo === 'gasto');

  const facturado = suma(cobros);
  const cobrado = suma(cobros.filter((m) => m.estado === 'hecho'));
  const porCobrar = facturado - cobrado;

  const hoy = hoyISO();
  const atrasado = suma(
    cobros.filter((m) => m.estado === 'pendiente' && m.fecha < hoy)
  );

  const equipoTotal = suma(pagos);
  const equipoPagado = suma(pagos.filter((m) => m.estado === 'hecho'));
  const gastoTotal = suma(gastos);

  // Dos lecturas distintas y las dos importan:
  // "neto" es lo que te queda si todo el mundo cumple;
  // "enMano" es lo que ya está en tu bolsillo hoy.
  const neto = facturado - equipoTotal - gastoTotal;
  const enMano = cobrado - equipoPagado - suma(gastos.filter((m) => m.estado === 'hecho'));

  return {
    facturado, cobrado, porCobrar, atrasado,
    equipoTotal, equipoPagado, gastoTotal,
    neto, enMano,
    margen: facturado ? Math.round((neto / facturado) * 100) : 0,
  };
}

/** Cuánto deja cada cliente después de pagarle al equipo. */
export function rentabilidadCliente(e, cliente, mes) {
  const delMes = e.movimientos.filter((m) => m.mes === mes && m.clienteId === cliente.id);
  const entra = delMes
    .filter((m) => m.tipo === 'cobro')
    .reduce((t, m) => t + pesosDe(m, e.ajustes), 0);
  const sale = delMes
    .filter((m) => m.tipo === 'pago')
    .reduce((t, m) => t + pesosDe(m, e.ajustes), 0);
  return { entra, sale, queda: entra - sale, margen: entra ? Math.round(((entra - sale) / entra) * 100) : 0 };
}
