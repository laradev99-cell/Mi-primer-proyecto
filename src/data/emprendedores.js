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
        'Vos grabás, yo te los edito. Subtítulos, transiciones, música y todos los recursos que el video necesite para que se mire hasta el final.',
      incluye: [
        'Subtítulos completos',
        'Transiciones y ritmo',
        'Música y efectos de sonido',
        'Entrega por Drive, listo para publicar',
      ],
      filas: [
        { nombre: '1 video', precio: 30000 },
        { nombre: 'Pack de 5 videos', precio: 150000 },
      ],
      adicional: {
        texto:
          '¿No sabés grabar o no tenés tiempo? Voy yo y grabamos los 5 videos en una sola jornada.',
        precio: 50000,
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
          detalle: '4 ideas de posteo + 10 de historia',
          precio: 60000,
        },
        {
          nombre: 'Completo',
          detalle: '6 ideas de posteo + 20 de historia',
          precio: 100000,
        },
      ],
      nota: 'Incluye una ronda de cambios.',
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
    ['Entrega', 'Hasta 5 días hábiles desde que recibo el material'],
    ['Ajustes', 'Una ronda de cambios incluida'],
    ['Los videos', 'Los grabás vos, salvo que sumes la jornada'],
  ],

  cierre: {
    titulo: '¿Arrancamos?',
    texto: 'Escribime y vemos cuál de los tres te sirve más.',
  },
};
