/*
 * Genera los iconos del panel instalado en el celular.
 *
 *   node scripts/armar-iconos.mjs
 *
 * El dibujo es el mismo punto violeta que tiene el panel arriba
 * a la izquierda, sobre el fondo tinta de la marca. A 48 píxeles
 * en la pantalla de inicio, cualquier cosa más detallada no se
 * distingue.
 *
 * Se escribe el PNG a mano (zlib + CRC) para no sumar una
 * dependencia al proyecto por dos archivos que casi nunca cambian.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const FONDO = [0x12, 0x04, 0x2e]; // --tinta
const PUNTO = [0xa8, 0x7c, 0xff]; // --violeta-400

function pixeles(lado) {
  const centro = lado / 2;
  // Radio chico: el sistema operativo recorta los bordes del icono
  // y hay que dejarle margen para que no se coma el dibujo.
  const radio = lado * 0.19;
  const filas = [];

  for (let y = 0; y < lado; y++) {
    const fila = [0]; // filtro "sin filtro" al arranque de cada fila
    for (let x = 0; x < lado; x++) {
      const d = Math.hypot(x + 0.5 - centro, y + 0.5 - centro);
      // Borde suavizado a mano: un píxel de transición alcanza.
      const mezcla = Math.min(Math.max(radio + 0.5 - d, 0), 1);
      for (let c = 0; c < 3; c++) {
        fila.push(Math.round(FONDO[c] + (PUNTO[c] - FONDO[c]) * mezcla));
      }
    }
    filas.push(Buffer.from(fila));
  }
  return Buffer.concat(filas);
}

function crc32(buf) {
  let c = ~0;
  for (const byte of buf) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function trozo(tipo, datos) {
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const suma = Buffer.alloc(4);
  suma.writeUInt32BE(crc32(cuerpo));
  return Buffer.concat([largo, cuerpo, suma]);
}

function png(lado) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(lado, 0);
  ihdr.writeUInt32BE(lado, 4);
  ihdr[8] = 8; // 8 bits por canal
  ihdr[9] = 2; // color verdadero, sin transparencia
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    trozo('IHDR', ihdr),
    trozo('IDAT', deflateSync(pixeles(lado), { level: 9 })),
    trozo('IEND', Buffer.alloc(0)),
  ]);
}

for (const lado of [192, 512]) {
  const archivo = `public/icono-${lado}.png`;
  writeFileSync(archivo, png(lado));
  console.log(archivo);
}
