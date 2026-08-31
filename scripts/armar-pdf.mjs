// Exporta una página ya construida a PDF, para mandarla por WhatsApp o
// mail sin depender de un servidor.
//
// Dos cosas que no son obvias y rompen el PDF si se pasan por alto:
//
// 1. Las secciones aparecen con scroll (data-revelar + IntersectionObserver).
//    Al imprimir no hay scroll, así que sin forzar la clase `visible` el
//    PDF sale con medias hojas en blanco. Se resuelve con reducedMotion,
//    que es la rama que la propia página usa para saltear la animación,
//    más un pase manual por si el observer no llegó a correr.
//
// 2. El Chromium del entorno no siempre coincide con la versión que pide
//    @playwright/test. Por eso se apunta al binario preinstalado en vez
//    de descargar uno nuevo.
//
// El corte de hojas se controla desde el @media print de cada página,
// no desde acá.
//
// Uso: node scripts/armar-pdf.mjs <archivo-html> <archivo-pdf>
//      node scripts/armar-pdf.mjs /tmp/propuesta.html /tmp/propuesta.pdf

import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const [entrada, salida] = process.argv.slice(2);

if (!entrada || !salida) {
  console.error('Faltan argumentos: <archivo-html> <archivo-pdf>');
  process.exit(1);
}

const rutaEntrada = resolve(entrada);

if (!existsSync(rutaEntrada)) {
  console.error(`No existe ${rutaEntrada}. ¿Corriste npm run build y armar-artefacto?`);
  process.exit(1);
}

const CHROMIUM_ENTORNO = '/opt/pw-browsers/chromium';

const navegador = await chromium.launch(
  existsSync(CHROMIUM_ENTORNO) ? { executablePath: CHROMIUM_ENTORNO } : {}
);

const contexto = await navegador.newContext({ reducedMotion: 'reduce' });
const pagina = await contexto.newPage();

await pagina.goto(`file://${rutaEntrada}`, { waitUntil: 'networkidle' });
await pagina.evaluate(() =>
  document
    .querySelectorAll('[data-revelar]')
    .forEach((el) => el.classList.add('visible'))
);
await pagina.waitForTimeout(500);

await pagina.pdf({
  path: salida,
  format: 'A4',
  printBackground: true,
  margin: { top: '0', bottom: '0', left: '0', right: '0' },
});

await navegador.close();

console.log(`✓ ${salida}`);
