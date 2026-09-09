/*
 * Revisa el panel en un navegador de verdad: lo llena con datos de
 * prueba, recorre las siete secciones y saca una captura de cada una
 * en celular y en escritorio. Al final avisa si hubo errores o si
 * quedó algún número roto en pantalla.
 *
 *   npm run build && npx astro preview --port 4321   (en otra terminal)
 *   node scripts/revisar-panel.mjs /tmp/panel
 *
 * Si Chromium está en otro lado: CHROME=/ruta/al/chrome node ...
 */
import { chromium } from '@playwright/test';

const SALIDA = process.argv[2] || '/tmp/panel';
const nav = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

const errores = [];
p.on('pageerror', (e) => errores.push(`pageerror: ${e.message}`));
p.on('requestfailed', (r) => errores.push(`falló: ${r.url()}`));
p.on('response', (r) => r.status() >= 400 && errores.push(`${r.status()}: ${r.url()}`));
p.on('console', (m) => m.type() === 'error' && errores.push(`console: ${m.text()}`));

await p.goto('http://localhost:4321/panel/', { waitUntil: 'networkidle' });

// ── Sembramos datos como los cargaría ella, pero por código,
//    para que la prueba sea rápida y repetible.
await p.evaluate(() => {
  const hoy = new Date();
  const mes = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
  const mesAtras = new Date(hoy.getFullYear(), hoy.getMonth() - 2, 1);
  const inicio = `${mesAtras.getFullYear()}-${String(mesAtras.getMonth() + 1).padStart(2, '0')}-01`;

  localStorage.setItem('naimid.panel.v1', JSON.stringify({
    version: 1,
    ajustes: { dolar: 1400, gastosFijos: [{ id: 'g1', concepto: 'Canva + Meta Ads', monto: 60, moneda: 'USD' }], borrados: [], desde: `${mesAtras.getFullYear()}-${String(mesAtras.getMonth() + 1).padStart(2, '0')}` },
    equipo: [
      { id: 'e1', nombre: 'Kevin', rol: 'Programación', pagoFijo: null },
      { id: 'e2', nombre: 'Sofi', rol: 'Edición de video', pagoFijo: 250000 },
      { id: 'e3', nombre: 'Juan', rol: 'Community', pagoFijo: null },
    ],
    clientes: [
      { id: 'c1', nombre: 'Marca Uno', servicio: 'redes', plan: 'CRECIMIENTO', tipo: 'mensual', monto: 1400000, moneda: 'ARS', diaCobro: 5, inicio, estado: 'activo', equipo: [{ personaId: 'e3', modo: 'porcentaje', valor: 20 }] },
      { id: 'c2', nombre: 'Marca Dos', servicio: 'redes', plan: 'EXPANSIÓN', tipo: 'mensual', monto: 1999000, moneda: 'ARS', diaCobro: 1, inicio, estado: 'activo', equipo: [{ personaId: 'e3', modo: 'fijo', valor: 300000 }] },
      { id: 'c3', nombre: 'Tienda Tres', servicio: 'web', plan: null, tipo: 'unico', monto: 700, moneda: 'USD', diaCobro: 10, inicio: `${mes}-10`, estado: 'activo', equipo: [{ personaId: 'e1', modo: 'fijo', valor: 400000 }] },
    ],
    movimientos: [],
    entregas: {},
    propuestas: [
      { id: 'p1', nombre: 'Marca Cuatro', servicio: 'vendedor', monto: 600000, moneda: 'ARS', etapa: 'enviada', fecha: `${mes}-02`, notas: 'Le interesa. Volver a escribirle el jueves.' },
      { id: 'p2', nombre: 'Marca Cinco', servicio: 'redes', monto: 1100000, moneda: 'ARS', etapa: 'negociando', fecha: `${mes}-04` },
    ],
  }));
});

// Cambiar solo el # no recarga la página: hay que forzarlo una vez
// para que el panel lea los datos recién sembrados.
await p.reload({ waitUntil: 'networkidle' });

const secciones = ['resumen', 'plata', 'clientes', 'equipo', 'trabajo', 'propuestas', 'ajustes'];
for (const s of secciones) {
  await p.evaluate((r) => { location.hash = `#/${r}`; }, s);
  await p.waitForTimeout(250);
  await p.screenshot({ path: `${SALIDA}-movil-${s}.png`, fullPage: true });
}

// Un par de comprobaciones sobre los números, no solo sobre la pinta.
const control = await p.evaluate(() => {
  const t = document.body.innerText;
  return {
    hayNaN: /NaN|undefined|Infinity/.test(t),
    resumen: t.slice(0, 400),
  };
});

// Interacción real: marcar un cobro como recibido.
await p.evaluate(() => { location.hash = '#/plata'; });
await p.waitForTimeout(200);
// El historial vive al pie de Plata: hay que bajar el panel para verlo.
await p.evaluate(() => { document.querySelector('.contenido').scrollTop = 99999; });
await p.waitForTimeout(300);
await p.screenshot({ path: `${SALIDA}-movil-historial.png` });

const antes = await p.locator('.tilde.marcada').count();
await p.locator('.tilde').first().click();
await p.waitForTimeout(200);
const despues = await p.locator('.tilde.marcada').count();

// Abrir un formulario.
await p.evaluate(() => { location.hash = '#/clientes'; });
await p.waitForTimeout(200);
await p.locator('[data-accion="nuevo-cliente"]').first().click();
await p.waitForTimeout(300);
const ventana = await p.locator('.ventana').count();
await p.screenshot({ path: `${SALIDA}-movil-formulario.png` });
await p.keyboard.press('Escape');

// Escritorio
const p2 = await (await nav.newContext({ viewport: { width: 1360, height: 900 } })).newPage();
await p2.goto('http://localhost:4321/panel/', { waitUntil: 'networkidle' });
await p2.evaluate((d) => localStorage.setItem('naimid.panel.v1', d), await p.evaluate(() => localStorage.getItem('naimid.panel.v1')));
await p2.reload({ waitUntil: 'networkidle' });
for (const s of ['resumen', 'clientes', 'trabajo']) {
  await p2.evaluate((r) => { location.hash = `#/${r}`; }, s);
  await p2.waitForTimeout(250);
  await p2.screenshot({ path: `${SALIDA}-escritorio-${s}.png` });
}

console.log(JSON.stringify({ errores, control, tildes: { antes, despues }, ventana }, null, 2));
await nav.close();
