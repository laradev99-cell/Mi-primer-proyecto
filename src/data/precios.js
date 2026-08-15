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

  // Los tres planes hacen el mismo trabajo: lo que cambia es cuánto
  // sale y cuánto seguimiento tenés. Por eso cada uno se presenta por
  // lo que conseguís, y el volumen baja al pie — que era lo único que
  // se leía antes.
  //
  // Los planes son acumulativos: `incluye` lista solo lo que agrega
  // sobre el anterior. El primero lleva la base completa.
  manejoRedes: {
    nombre: 'Manejo de redes',
    bajada: 'Tres formas de trabajar. Cambia cuánto contenido sale y cuánto seguimiento tenés.',
    planes: [
      {
        nombre: 'PRESENCIA',
        promesa: 'Ordenamos tu marca',
        precio: 1100000,
        incluye: [
          'Estrategia a 3 meses y plan de contenido mensual',
          'Diseño, edición y textos de cada pieza',
          'Publicación en Instagram',
          'Te decimos qué grabar cada mes',
        ],
        volumen: 'Hasta 6 posteos y 18 historias',
      },
      {
        nombre: 'CRECIMIENTO',
        promesa: 'Sabés qué está funcionando y qué no',
        precio: 1400000,
        // El del medio es el que queremos que se elija: salto chico
        // desde el primero y el grueso del seguimiento.
        destacado: true,
        hereda: 'Presencia',
        incluye: [
          'Reporte mensual de resultados',
          'Reunión mensual para decidir el mes siguiente',
          'Prioridad en las respuestas',
        ],
        volumen: 'Hasta 8 posteos y 26 historias',
      },
      {
        nombre: 'EXPANSIÓN',
        promesa: 'Más contenido, y alguien con quien pensarlo',
        precio: 1999000,
        hereda: 'Crecimiento',
        incluye: [
          'Publicación también en Facebook',
          'Media hora por mes conmigo para pensar tu marca: tu contenido, tu forma de vender, tu próximo paso. Lo que te esté trabando',
          '15 % de descuento en páginas web y en el vendedor que nunca duerme',
        ],
        // El cupo es real: la media hora mensual la doy yo, así que el
        // plan no escala. Actualizar cuando se ocupen los lugares.
        cupo: 'Solo 3 marcas en este plan',
        volumen: 'Hasta 10 posteos y 34 historias',
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
      { nombre: 'Mejorar tu tienda', precio: 300000 },
      { nombre: 'Landing page', precioUsd: 200 },
    ],
    nota: 'La plataforma y el dominio los paga el cliente directo al proveedor. El desarrollo a medida se cotiza en dólares.',
  },

  // No se vende como "IA" o "automatización" — eso es la tecnología
  // por dentro, no el valor. Se vende como lo que evita: la venta que
  // se enfría por tardar en contestar.
  respuestasAutomaticas: {
    nombre: 'El vendedor que nunca duerme',
    descripcion:
      'La mayoría de los mensajes que recibe una tienda son siempre los mismos: precio, stock, envío, talle. Cada uno que tarda en responderse es una venta que se enfría — y a la 1 de la mañana, un domingo, o en medio de otra cosa, no siempre podés estar ahí.\n\nEsto sí. Conoce tu negocio a fondo y responde en Instagram y WhatsApp las 24 horas, con el mismo tono que usarías vos. Nadie nota que no sos vos. Y te deriva solo las consultas que valen tu tiempo.',
    instalacion: 600000,
    lanzamiento: 400000,
    mantenimiento: 80000,
    aclaracion:
      'La instalación se paga una vez y queda un lugar al precio de lanzamiento. El mantenimiento no es mensual: se cobra solo cuando hay que actualizar algo.',
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

    // Trabajo sobre plataforma: sigue en pesos porque se cotiza contra
    // costos locales, no contra el dólar.
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
        nombre: 'Mejorar tu tienda',
        descripcion:
          'Miramos todo el sitio y mejoramos lo que haga falta: rediseño, fichas de producto, velocidad, medios de pago y orden.',
        precio: 300000,
        tiempo: '1 semana',
        incluye: [
          'Rediseño de la tienda',
          'Optimización de fichas',
          'Carga de 10 productos',
        ],
      },
      {
        nombre: 'Migrar tu tienda',
        descripcion:
          'Pasamos una tienda que ya existe a otra plataforma, sin perder productos ni posicionamiento.',
        precio: 450000,
        tiempo: '1 a 2 semanas',
        incluye: [
          'Traspaso completo del catálogo',
          'Configuración desde cero',
          'Revisión antes de salir',
        ],
      },
    ],

    // Un solo precio por servicio, lo programe quien lo programe.
    // En dólares porque es desarrollo a medida, no trabajo sobre
    // plataforma: precio null significa "desde", con la cifra en `desde`.
    medida: {
      nombre: 'Desarrollo a medida',
      bajada: 'Cuando una plataforma no alcanza. Programado desde cero, con código propio.',
      webYTiendas: [
        { nombre: 'Landing page', precioUsd: 200 },
        { nombre: 'Catálogo digital con pedidos', precioUsd: 260 },
        { nombre: 'Web institucional', precioUsd: 700 },
        {
          nombre: 'Tienda ecommerce con carrito y pagos',
          precioUsd: null,
          desde: 500,
          nota: 'Se cotiza según el catálogo, el panel de administración y las cuentas de usuario.',
        },
      ],
      sistemasYApps: [
        {
          nombre: 'Sistema administrativo',
          descripcion: 'Stock, clientes, turnos, reportes',
          precioUsd: 2250,
        },
        { nombre: 'Aplicación móvil (Android/iOS)', precioUsd: 1650 },
        { nombre: 'Aplicación de escritorio', precioUsd: 2000 },
      ],
      nota: 'El hosting, el dominio y las cuentas de desarrollador (Google Play, App Store) los paga el cliente directamente al proveedor.',
    },

    automatizacion: [
      {
        nombre: 'El vendedor que nunca duerme',
        descripcion:
          'Cada mensaje que tarda en responderse es una venta que se enfría. Esto contesta por vos al instante, sea la hora que sea, con el mismo tono que usarías vos — nadie nota la diferencia.',
        instalacion: 600000,
        // Precio de lanzamiento: queda un lugar. Sacar `lanzamiento`
        // cuando se ocupe y la página se acomoda sola.
        lanzamiento: 400000,
        lanzamientoNota: 'Queda un lugar a este precio. Del siguiente en adelante, $600.000.',
        // Dejó de ser mensual: se cobra solo cuando hay que tocar algo.
        mantenimiento: 80000,
        mantenimientoNota: 'Por pedido, cuando necesites una actualización o un cambio.',
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
