/*
 * Revisión liviana del panel ya empaquetado: confirma que no tira
 * errores de JavaScript y que la pantalla de "no se pudo conectar"
 * se ve bien — es lo único que se puede probar fuera del visor de
 * Claude, porque ahí no existe `window.claude` y la base nunca
 * conecta (ver PANEL.md, "El límite de tamaño" y la sección de
 * pruebas).
 *
 * Para probar altas, bajas y cambios reales de datos no sirve un
 * navegador suelto: se usa la herramienta ArtifactData
 * (get/set/query) sobre el Artifact ya publicado.
 *
 *   npm run build
 *   node inline.cjs panel/index.html /tmp/panel.html
 *   node scripts/revisar-panel.mjs /tmp/panel.html /tmp/captura.png
 *
 * Si Chromium está en otro lado: CHROME=/ruta/al/chrome node ...
 */
import { chromium } from '@playwright/test';

const ARCHIVO = process.argv[2];
const SALIDA = process.argv[3] || '/tmp/panel-revisado.png';

if (!ARCHIVO) {
  console.error('Uso: node scripts/revisar-panel.mjs <archivo.html> [salida.png]');
  process.exit(1);
}

const nav = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

const errores = [];
p.on('pageerror', (e) => errores.push(`pageerror: ${e.message}`));
p.on('requestfailed', (r) => errores.push(`falló: ${r.url()}`));
p.on('response', (r) => r.status() >= 400 && errores.push(`${r.status()}: ${r.url()}`));
p.on('console', (m) => m.type() === 'error' && errores.push(`console: ${m.text()}`));

await p.goto(`file://${ARCHIVO}`, { waitUntil: 'networkidle' });

// Sin `window.claude`, `claude.use('db')` tarda hasta 10s en
// resolver `null` (así lo documenta la plataforma) antes de que el
// panel muestre el aviso de conexión.
await p.waitForTimeout(11000);
await p.screenshot({ path: SALIDA });

const texto = await p.locator('body').innerText();
const avisoOk = texto.includes('No se pudo conectar');

console.log(JSON.stringify({ errores, avisoDeConexionVisible: avisoOk }, null, 2));
if (errores.length || !avisoOk) process.exitCode = 1;

await nav.close();
