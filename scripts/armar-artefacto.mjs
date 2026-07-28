// Arma una versión de una página en un solo archivo, para publicarla
// como artefacto o mandarla por mail sin depender de un servidor.
//
// Los artefactos bloquean pedidos a otros dominios, así que Google Fonts
// nunca carga: la tipografía tiene que viajar adentro del archivo.
// Por eso las fuentes se incrustan en base64 en lugar de enlazarse.
//
// Uso: node scripts/armar-artefacto.mjs <ruta-en-dist> <archivo-salida> [enlaces]
//      node scripts/armar-artefacto.mjs webs /tmp/webs.html
//      node scripts/armar-artefacto.mjs index /tmp/inicio.html '{"/webs":"https://..."}'
//
// El tercer argumento reemplaza enlaces internos por direcciones completas:
// entre artefactos no hay carpetas compartidas, así que "/webs" no lleva
// a ningún lado y hay que apuntar a la dirección real de la otra página.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [ruta, salida, enlacesJson] = process.argv.slice(2);

if (!ruta || !salida) {
  console.error('Faltan argumentos: <ruta-en-dist> <archivo-salida>');
  process.exit(1);
}

const DIST = 'dist';
const origen =
  ruta === '.' || ruta === 'index'
    ? join(DIST, 'index.html')
    : join(DIST, ruta, 'index.html');

if (!existsSync(origen)) {
  console.error(`No existe ${origen}. ¿Corriste npm run build?`);
  process.exit(1);
}

let html = readFileSync(origen, 'utf8');

// ── 1. Juntar el CSS que la página enlaza ──
const hojas = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g)];
let css = hojas
  .map((m) => readFileSync(join(DIST, m[1].replace(/^\//, '')), 'utf8'))
  .join('\n');

// ── 2. Meter las fuentes adentro del CSS ──
// Solo woff2: lo entiende todo navegador vivo y pesa la mitad que woff.
const fuentes = new Set();
css = css.replace(/url\(([^)]*\.woff2)\)/g, (_, url) => {
  const limpia = url.replace(/^["']|["']$/g, '').replace(/^\//, '');
  const archivo = join(DIST, limpia);
  if (!existsSync(archivo)) return `url(${url})`;
  fuentes.add(limpia);
  const b64 = readFileSync(archivo).toString('base64');
  return `url(data:font/woff2;base64,${b64})`;
});

// Las declaraciones woff sobran una vez incrustado el woff2
css = css.replace(/,\s*url\([^)]*\.woff\)\s*format\("woff"\)/g, '');

// ── 3. Quedarse con el contenido, sin el esqueleto ──
// El artefacto pone su propio doctype, head y body.
let cuerpo = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? html;
const titulo = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';

// ── 4. Apuntar los enlaces internos a las otras páginas publicadas ──
if (enlacesJson) {
  for (const [interno, real] of Object.entries(JSON.parse(enlacesJson))) {
    cuerpo = cuerpo.replaceAll(`href="${interno}"`, `href="${real}"`);
  }
}

const armado = `<title>${titulo}</title>
<style>
${css}
</style>
${cuerpo.trim()}
`;

writeFileSync(salida, armado);

const kb = (armado.length / 1024).toFixed(0);
console.log(`✓ ${salida} — ${kb} KB, ${fuentes.size} fuentes incrustadas`);
