// Precios de Naimid.Agency
// Actualizar cada 3 meses (enero, abril, julio, octubre)
//
// Para dejar un precio en pausa: poné `precio: null` y escribí en `nota`
// lo que tiene que leer el cliente. La página se acomoda sola.

export const precios = {
  analisisEstrategia: {
    nombre: 'Análisis y estrategia',
    bajada: 'Antes de publicar, entendemos.',
    precio: 150000,
    incluye: [
      'Briefing y diagnóstico de tu marca',
      'Análisis de lo que veniste haciendo',
      'Definición de tus pilares de contenido',
      'Plan estratégico a 3 meses',
      'Tu Kit de Grabación personalizado',
      'Reunión de presentación',
    ],
    frecuencia: 'Pago único. Se repite cada 3 meses para recalibrar el rumbo.',
  },

  manejoRedes: {
    nombre: 'Manejo de redes',
    bajada: 'Los tres planes incluyen lo mismo. Cambia el volumen.',
    // Precio de lanzamiento: cupo limitado, no un descuento permanente.
    // Sacar precioAnterior y lanzamiento cuando se agoten los 5 lugares.
    lanzamiento: 'Precio de lanzamiento — válido para los primeros 5 clientes del nicho ecommerce',
    incluye: [
      'Ideas y plan de contenido mensual',
      'Diseño y edición de cada pieza',
      'Textos escritos para vender',
      'Publicación en Instagram y Facebook',
      'Te decimos qué grabar cada mes',
      'Reporte mensual de resultados',
      'Reunión mensual',
    ],
    planes: [
      {
        nombre: 'PRESENCIA',
        descripcion: '6 posteos + 18 historias',
        detalles: '3 reels · 3 carruseles',
        precioAnterior: 1380000,
        precio: 1200000,
      },
      {
        nombre: 'CRECIMIENTO',
        descripcion: '8 posteos + 26 historias',
        detalles: '4 reels · 4 carruseles',
        precioAnterior: 1760000,
        precio: 1580000,
      },
      {
        nombre: 'EXPANSIÓN',
        descripcion: '10 posteos + 34 historias',
        detalles: '5 reels · 5 carruseles',
        precioAnterior: 2250000,
        precio: 2070000,
      },
    ],
  },

  // Resumen para la propuesta: solo lo más pedido. El catálogo entero
  // vive en paginasWeb y se muestra en /webs, adonde lleva el botón.
  tiendaOnline: {
    nombre: 'Páginas web',
    bajada: 'Lo que más nos piden. Si buscás otra cosa, está todo en la página de webs.',
    opciones: [
      { nombre: 'Tienda Nube · hasta 30 productos', precio: 390000 },
      { nombre: 'Shopify', precio: 320000 },
      { nombre: 'Mejorar o migrar tu tienda', precio: 140000 },
      { nombre: 'Página web personalizada', precio: 300000 },
    ],
    nota: 'La plataforma y el dominio los paga el cliente directo al proveedor.',
  },

  // No se vende como "IA" o "automatización" — eso es la tecnología
  // por dentro, no el valor. Se vende como lo que evita: la venta que
  // se enfría por tardar en contestar.
  respuestasAutomaticas: {
    nombre: 'El vendedor que nunca duerme',
    descripcion:
      'La mayoría de los mensajes que recibe una tienda son siempre los mismos: precio, stock, envío, talle. Cada uno que tarda en responderse es una venta que se enfría — y a la 1 de la mañana, un domingo, o en medio de otra cosa, no siempre podés estar ahí.\n\nEsto sí. Conoce tu negocio a fondo y responde en Instagram y WhatsApp las 24 horas, con el mismo tono que usarías vos. Nadie nota que no sos vos. Y te deriva solo las consultas que valen tu tiempo.',
    instalacion: 400000,
    mantenimiento: 87500,
    aclaracion:
      'La instalación se paga una vez. El mantenimiento es mensual y cubre los ajustes a medida que cambia tu negocio.',
  },

  // ───────────────────────────────────────────────────────────
  // PÁGINAS WEB
  // Vive en su propia landing (/webs) para poder mandarse sola,
  // sin arrastrar el servicio de redes.
  // ───────────────────────────────────────────────────────────
  paginasWeb: {
    bajada:
      'Programamos el lugar donde tu marca vende. Desde una tienda lista en dos semanas hasta un sistema hecho a medida.',

    tiendaNube: {
      nombre: 'Tienda Nube',
      descripcion:
        'Tienda lista y optimizada para vender: fichas que convencen, medios de pago y envíos ya configurados.',
      tiempo: '1 a 2 semanas',
      necesitamos:
        'Tu catálogo con productos, precios y fotos, el logo, y qué medios de pago y envío usás.',
      incluye: [
        'Diseño pensado para convertir',
        'Medios de pago configurados',
        'Envíos integrados',
        'Fichas de producto que convencen',
      ],
      planes: [
        { nombre: 'BÁSICO', volumen: 'Hasta 10 productos', precio: 260000 },
        { nombre: 'INTERMEDIO', volumen: 'Hasta 30 productos', precio: 390000 },
        { nombre: 'AVANZADO', volumen: 'Sin límite de productos', precio: 444000 },
      ],
      nota: 'La plataforma y el dominio los pagás vos directo al proveedor.',
    },

    tiendas: [
      {
        nombre: 'Shopify',
        descripcion:
          'Para marcas que quieren crecer o vender al exterior. Más personalizable y más potente.',
        precio: 320000,
        tiempo: '1 a 2 semanas',
        incluye: ['Tienda personalizada', 'Medios de pago', 'Envíos y gestión'],
      },
      {
        nombre: 'Mejorar o migrar tu tienda',
        descripcion:
          'Revisamos la tienda que ya tenés y le subimos la conversión: fichas, velocidad, medios de pago y orden.',
        precio: 140000,
        tiempo: '1 semana',
        incluye: [
          'Revisión completa',
          'Optimización de fichas',
          'Mejora de conversión',
        ],
      },
    ],

    webs: [
      {
        nombre: 'Landing page',
        descripcion:
          'Una sola página enfocada en una oferta. Hecha para convertir, perfecta para acompañar publicidad.',
        precio: 140000,
        tiempo: '3 a 7 días',
        incluye: [
          'Diseño personalizado',
          'Optimizada para convertir',
          'Contacto integrado',
        ],
      },
      {
        nombre: 'Web institucional',
        descripcion:
          'Sitio programado, no una plantilla. Rápido y con el diseño propio de tu marca.',
        precio: 300000,
        tiempo: '1 a 3 semanas',
        incluye: ['Varias páginas', 'Rápida y optimizada', 'Diseño a medida'],
      },
      {
        nombre: 'Catálogo con pedidos por WhatsApp',
        descripcion:
          'Tu cliente arma el pedido y te llega listo al WhatsApp del local. Ideal para gastronomía.',
        precio: 240000,
        tiempo: '1 a 2 semanas',
        incluye: [
          'Sistema de pedidos integrado',
          'Conexión con WhatsApp',
          'Gestión de catálogo',
        ],
      },
    ],

    // En dólares a propósito: es el desarrollador que programa a medida,
    // aparte del resto de servicios (que cotizan en pesos). Marca que es
    // un servicio distinto, más premium.
    medida: {
      nombre: 'Desarrollo a medida',
      bajada: 'Cuando una plataforma no alcanza. Programado desde cero, con código propio.',
      webYTiendas: [
        { nombre: 'Landing page', precioUsd: 200 },
        { nombre: 'Catálogo digital con pedidos', precioUsd: 260 },
        { nombre: 'Web empresarial', precioUsd: 700 },
        { nombre: 'Tienda ecommerce con carrito y pagos', precioUsd: 1200 },
      ],
      sistemasYApps: [
        { nombre: 'Aplicación móvil (Android/iOS)', precioUsd: 1650 },
        { nombre: 'Aplicación de escritorio', precioUsd: 2000 },
        {
          nombre: 'Sistema administrativo',
          descripcion: 'Stock, clientes, turnos, reportes',
          precioUsd: 2250,
        },
      ],
      // Este segmento lo cotiza en exclusiva el desarrollador que lo arma:
      // no lo ofrece nadie más del equipo.
      notaExclusividad: 'Este segmento no lo ofrece nadie más en el equipo — es exclusivo de este desarrollador.',
      nota: 'El hosting, el dominio y las cuentas de desarrollador (Google Play, App Store) los paga el cliente directamente al proveedor.',
    },

    automatizacion: [
      {
        nombre: 'El vendedor que nunca duerme',
        descripcion:
          'Cada mensaje que tarda en responderse es una venta que se enfría. Esto contesta por vos al instante, sea la hora que sea, con el mismo tono que usarías vos — nadie nota la diferencia.',
        instalacion: 400000,
        mantenimiento: 87500,
        tiempo: '1 a 2 semanas',
        incluye: [
          'Contesta al toque, aunque sea la 1 de la mañana',
          'Sabe tu negocio a fondo: precios, stock, envíos',
          'Cierra pedidos y agenda turnos solo',
          'Vos entrás solo cuando hace falta',
        ],
      },
    ],
  },

  condiciones: {
    pago: '100% por adelantado al inicio de cada mes.',
    duracion:
      'El trabajo se contrata por 3 meses. Es el tiempo mínimo para que una estrategia muestre resultados reales. Cumplido ese plazo, seguimos mes a mes.',
    ajuste:
      '10% cada 3 meses, avisado con 30 días. Pagando 3 meses adelantados congelás el precio y obtenés 5% de descuento.',
    revisiones: 'Dos rondas de ajustes por pieza, sin cargo.',
  },

  loQueNecesitamos: {
    items: [
      'Grabar el material que te pedimos y mandarlo en tiempo y forma',
      'Aprobar el plan de contenido dentro de las 72 horas',
      'Avisarnos lanzamientos o promos al comienzo de cada mes',
      'Darnos acceso a tus redes',
      'Estar en la reunión mensual',
    ],
    nota: 'Si vos cumplís esto, nosotros nos hacemos cargo de todo lo demás.',
  },
};
