/*
 * Empaqueta una página del build en un solo archivo HTML autocontenido:
 * CSS, JS y las tipografías Poppins quedan incrustados.
 * Sirve para previsualizar el sitio sin servidor.
 *
 *   node inline.cjs <ruta-en-dist> <salida.html>
 *   node inline.cjs index.html /tmp/vista-inicio.html
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const entrada = process.argv[2] || 'index.html';
const salida = process.argv[3] || '/tmp/vista.html';

let html = fs.readFileSync(path.join(DIST, entrada), 'utf8');

// ── CSS: reemplaza cada <link rel=stylesheet> por su contenido ──
html = html.replace(
  /<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
  (_, href) => {
    let css = fs.readFileSync(path.join(DIST, href.replace(/^\//, '')), 'utf8');

    // Tipografías → data: URI (el visor bloquea pedidos externos)
    css = css.replace(/url\(([^)]+\.woff2?)\)/g, (m, ruta) => {
      const limpia = ruta.replace(/['"]/g, '').replace(/^\//, '');
      const archivo = path.join(DIST, limpia);
      if (!fs.existsSync(archivo)) return m;
      const tipo = archivo.endsWith('.woff2') ? 'font/woff2' : 'font/woff';
      return `url(data:${tipo};base64,${fs.readFileSync(archivo).toString('base64')})`;
    });

    return `<style>${css}</style>`;
  }
);

// ── JS ──
html = html.replace(
  /<script[^>]*src="([^"]+)"[^>]*><\/script>/g,
  (m, src) => {
    const archivo = path.join(DIST, src.replace(/^\//, ''));
    if (!fs.existsSync(archivo)) return m;
    return `<script type="module">${fs.readFileSync(archivo, 'utf8')}</script>`;
  }
);

// ── Deja solo <title>, <style> y el contenido del body ──
const titulo = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1];
const estilos = (html.match(/<style>[\s\S]*?<\/style>/g) || []).join('\n');
const cuerpo = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, html])[1];

fs.writeFileSync(salida, `<title>${titulo}</title>\n${estilos}\n${cuerpo}`);

const kb = (fs.statSync(salida).size / 1024).toFixed(0);
console.log(`${salida} — ${kb} KB`);
