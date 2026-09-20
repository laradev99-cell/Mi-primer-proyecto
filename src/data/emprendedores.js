// Línea para emprendedores — vive en /emprendedores.
//
// Página aparte, sin link desde ningún lado: los precios son más bajos
// que los del resto del sitio y no tienen que mezclarse. Se llega solo
// por link directo, y la página va con noindex.

// ─────────────────────────────────────────────────────────────
// LUGARES DISPONIBLES
// Este es el número que se actualiza a mano a medida que se ocupan.
// Cambialo acá y se acomoda toda la página: el badge de la portada,
// el texto de "¿Esto es para vos?" y los plurales.
// Con 0 el badge desaparece y el texto pasa a lista de espera.
// ─────────────────────────────────────────────────────────────
export const LUGARES_DISPONIBLES = 5;

// El badge de la portada. Devuelve null cuando no queda ninguno,
// así la portada no muestra una caja vacía.
export function lugaresBadge(n = LUGARES_DISPONIBLES) {
  if (n <= 0) return null;
  return n === 1 ? 'Queda 1 lugar' : `Solo ${n} lugares`;
}

// La frase de la sección "¿Esto es para vos?".
export function lugaresTexto(n = LUGARES_DISPONIBLES) {
  if (n <= 0) {
    return 'Ahora mismo los lugares están ocupados, pero escribime igual y te aviso apenas se libere uno.';
  }
  if (n === 1) {
    return 'Queda un solo lugar, porque los abro de a poco para poder trabajar tranquila con cada uno.';
  }
  return `Abro solo ${n} lugares para poder trabajar tranquila con cada uno.`;
}

export const emprendedores = {
  hero: {
    kicker: 'NAIMID.AGENCŸ',
    titulo: 'Para marcas que recién arrancan',
    bajada:
      'Tres servicios pensados para emprendedores que quieren empezar a mostrarse bien, sin tener que contratar una agencia completa.',
  },

  paraQuien: {
    titulo: '¿Esto es para vos?',
    texto:
      'Sí, si estás arrancando con tu marca, si todavía no facturás como para contratar una agencia, y si querés hacer las cosas bien desde el principio.',
  },

  // Cada servicio arma su caja con lo que tenga cargado: `incluye`,
  // `filas` (nombre + precio), `adicional` y `destacado` son todos
  // opcionales. El tercero lleva `principal: true` y se ve distinto.
  servicios: [
    {
      kicker: 'Servicio 01',
      titulo: 'Edición de videos',
      texto:
        'Vos grabás, yo te los edito. Es una edición simple y prolija, para que el video se mire hasta el final.',
      incluye: [
        'Subtítulos completos',
        'Transiciones y ritmo',
        'Música y efectos de sonido',
        'Entrega por Drive, listo para publicar',
      ],
      // Las dos reglas que evitan que el servicio se estire: el guion
      // no entra, y el material se recibe una sola vez. Si los videos
      // llegan de a uno, el trabajo se parte en tres y el plazo no se
      // puede sostener.
      aclaraciones: [
        'La idea la pensás vos: qué decir, qué mostrar y cómo. Yo me encargo de editar, no de armar el contenido.',
        'Mandame los 3 videos juntos. Desde que los recibo, en 4 días hábiles los tenés editados.',
      ],
      // Se vende el pack entero, no el video suelto: el precio por
      // unidad invitaba a pedir uno solo.
      precioEtiqueta: 'Los 3 videos editados',
      precio: 90000,
      adicional: {
        texto:
          '¿No sabés grabar o no tenés tiempo? Voy yo y grabamos los 3 videos en una sola jornada.',
        precio: 30000,
      },
    },

    {
      kicker: 'Servicio 02',
      titulo: 'Ideas de contenido',
      texto:
        'Te armo qué publicar todo el mes, para que no tengas que sentarte a pensarlo cada vez. Cada idea viene con el concepto, qué grabar o mostrar, y el texto sugerido.',
      filas: [
        {
          nombre: 'Básico',
          detalle: '4 ideas de posteo y 12 de historia',
          apunte: 'Repartidas en las 4 semanas del mes',
          precio: 50000,
        },
        {
          nombre: 'Completo',
          detalle: '8 ideas de posteo y 20 de historia',
          apunte: 'Repartidas en las 4 semanas del mes',
          precio: 90000,
        },
      ],
      nota: 'Te las mando todas juntas, listas para todo el mes. Incluye una ronda de cambios.',
    },

    {
      kicker: 'Servicio 03',
      titulo: 'Asesoramiento',
      principal: true,
      texto:
        'Nos sentamos dos horas a mirar tu cuenta y salís sabiendo exactamente qué hacer.',
      incluye: [
        'Revisión completa de tu perfil: nombre, biografía, palabras clave y destacados',
        'Análisis de lo que venís publicando: qué funcionó, qué no y por qué',
        'Tus pilares de contenido, para dejar de publicar siempre lo mismo',
        'Cómo mostrar tu producto sin repetir siempre la misma foto',
        'Cómo humanizar tu cuenta y que la gente te elija a vos',
        'Horarios, frecuencia y cómo leer tus métricas',
      ],
      destacado:
        'Unos días después te mando un PDF con todo lo que hablamos, más 15 ideas de contenido para arrancar.',
      precio: 120000,
      nota: 'Puede ser por videollamada o presencial.',
    },
  ],

  comoTrabajamos: [
    ['Pago', '100% por adelantado'],
    ['Entrega', 'Hasta 5 días hábiles desde que recibo todo el material'],
    ['Ajustes', 'Una ronda de cambios incluida'],
    ['Los videos', 'Los grabás vos y me los mandás juntos, salvo que sumes la jornada'],
  ],

  cierre: {
    titulo: '¿Arrancamos?',
    texto: 'Escribime y vemos cuál de los tres te sirve más.',
  },
};
