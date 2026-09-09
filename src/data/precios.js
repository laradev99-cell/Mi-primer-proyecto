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
      'Reunión de presentación',
    ],
    frecuencia: 'Pago único. Se repite cada 3 meses para recalibrar el rumbo.',
  },

  // Cada plan lista todo lo que incluye, no solo lo que suma sobre el
  // anterior: el "todo lo de X, más" obligaba a leer tres tarjetas para
  // entender una. El volumen va al pie, que era lo único que se leía.
  //
  // La estrategia no se repite acá: se cobra aparte en analisisEstrategia.
  //
  // ── Cómo se fijan estos precios ──
  // No se usa un porcentaje fijo: se parte de cuánto tiene que quedar
  // en la mano y se le suma el costo del equipo. La prioridad hoy es
  // que el servicio se venda, no maximizar el margen — por eso el
  // porcentaje baja a medida que sube el plan.
  //
  //   Plan         Costo      Queda      Precio      % costo
  //   Esencial     $341.500   $518.500   $860.000     39,7%
  //   Presencia    $597.500   $672.500   $1.270.000   47,0%
  //   Crecimiento  $853.000   $827.000   $1.680.000   50,8%
  //
  // Tarifas con las que se calculó: Sol $5.000 por idea y $30.000 el
  // reporte; Renata $5.000 el posteo y $4.500 la historia; Santi
  // $22.000 el reel, $20.000 el carrusel, $9.000 la historia video y
  // $5.500 la de foto; jornada de grabación $50.000.
  //
  // Presencia subió de 6 a 7 posteos sin tocar el precio: el posteo
  // número 7 cuesta $5.000 la idea más $5.000 la publicación, y la
  // edición la absorbe la casa. Son $10.000 de margen a cambio de que
  // el plan del medio — el que lleva el sello "el más elegido" — no se
  // vea corto al lado de Crecimiento.
  //
  // Ojo al recalcular: Sol tiene paquetes por volumen, Renata y Santi
  // cobran por pieza sin descuento. Por eso el costo de los planes
  // grandes crece en línea recta y el margen se achica arriba.
  manejoRedes: {
    nombre: 'Manejo de redes',
    bajada: 'Tres formas de trabajar. Cambia cuánto contenido sale y cuánto seguimiento tenés.',
    planes: [
      {
        nombre: 'ESENCIAL',
        promesa: 'Tu marca deja de estar quieta',
        precio: 860000,
        // Los ítems siguen el ciclo real del trabajo — pensamos,
        // grabamos, editamos, publicamos — para que se lea como un
        // servicio completo y no como una lista de tareas sueltas.
        //
        // Se renderizan con set:html para poder destacar el número de
        // jornadas, que es lo que más cambia de un plan a otro.
        incluye: [
          'Pensamos todas las ideas del mes para tu marca',
          'Vamos a grabar a tu local <strong>una vez</strong> al mes',
          'Diseñamos y editamos cada pieza',
          'Publicamos por vos en Instagram',
        ],
        volumen: 'Hasta 4 posteos y 10 historias',
      },
      {
        nombre: 'PRESENCIA',
        promesa: 'Tu marca aparece todas las semanas',
        precio: 1270000,
        destacado: true,
        incluye: [
          'Pensamos todas las ideas del mes para tu marca',
          'Vamos a grabar a tu local <strong>dos veces</strong> al mes',
          'Diseñamos y editamos cada pieza',
          'Publicamos por vos en Instagram',
        ],
        volumen: 'Hasta 7 posteos y 18 historias',
      },
      {
        nombre: 'CRECIMIENTO',
        promesa: 'Tu marca crece y sabés por qué',
        precio: 1680000,
        incluye: [
          'Pensamos todas las ideas del mes para tu marca',
          'Vamos a grabar a tu local <strong>tres veces</strong> al mes',
          'Diseñamos y editamos cada pieza',
          'Publicamos por vos en Instagram y Facebook',
          'Reporte mensual: qué funcionó y qué no',
          '15 % de descuento en páginas web y en el vendedor que nunca duerme',
        ],
        volumen: 'Hasta 8 posteos y 26 historias',
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
      'La mayoría de los mensajes que recibe una tienda son siempre los mismos: precio, stock, envío, talle. Cada uno que tarda en responderse es una venta que se enfría — y a la 1 de la mañana, un domingo, o en medio de otra cosa, no siempre podés estar ahí.\n\nEn WhatsApp le armamos un asistente que conoce tu negocio a fondo y contesta con tus palabras las 24 horas. Nadie nota que no sos vos, y te deriva solo las consultas que valen tu tiempo.\n\nEn Instagram todavía no se puede correr el asistente completo, así que dejamos respuestas automáticas que atienden lo básico y llevan la conversación a WhatsApp.',
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
        // Ojo: la IA corre en WhatsApp. Instagram todavía no la permite
        // sin un permiso de Meta que no tenemos, así que ahí van
        // respuestas automáticas que derivan a WhatsApp. No prometer IA
        // en Instagram hasta que salga el permiso.
        descripcion:
          'Cada mensaje que tarda en responderse es una venta que se enfría. En WhatsApp contesta por vos al instante, sea la hora que sea, con el mismo tono que usarías vos — nadie nota la diferencia.',
        instalacion: 600000,
        // Precio de lanzamiento: queda un lugar. Sacar `lanzamiento`
        // cuando se ocupe y la página se acomoda sola.
        lanzamiento: 400000,
        lanzamientoNota: 'Queda un lugar a este precio. Del siguiente en adelante, $600.000.',
        // Dejó de ser mensual: se cobra solo cuando hay que tocar algo.
        mantenimiento: 80000,
        mantenimientoNota: 'Por pedido, cuando necesites una actualización o un cambio.',
        tiempo: '1 a 2 semanas',
        bajada: 'Cada mensaje que tarda en responderse es una venta que se enfría.',
        // Lo que lo separa de un bot de menú: entiende preguntas libres
        // porque conoce el negocio, no porque siga un árbol de botones.
        diferencial:
          'La mayoría de los bots siguen un menú de botones: si el cliente pregunta algo que no estaba previsto, se traba. Este no. Le cargamos toda la información de tu negocio, así que entiende preguntas libres y contesta con tus palabras.',
        sirvePara: [
          'Comercios y tiendas online',
          'Gastronomía',
          'Clínicas y consultorios',
          'Profesionales que agendan turnos',
          'Gimnasios e inmobiliarias',
        ],
        necesitamos:
          'La información de tu negocio y el número de WhatsApp Business.',
        incluye: [
          'Contesta al toque, aunque sea la 1 de la mañana',
          'Sabe tu negocio a fondo: precios, stock, envíos',
          'Cierra pedidos y agenda turnos solo',
          'Vos entrás solo cuando hace falta',
        ],
        // Dos canales, dos cosas distintas. Se cuentan separadas para no
        // vender en Instagram algo que hoy solo corre en WhatsApp.
        canales: [
          {
            nombre: 'En WhatsApp',
            tipo: 'El asistente completo',
            texto:
              'Entiende preguntas libres, conoce tu negocio y responde con tus palabras. Toma pedidos y agenda turnos sin que entres vos.',
          },
          {
            nombre: 'En Instagram',
            tipo: 'Respuestas automáticas',
            texto:
              'Todavía no se puede correr el asistente completo, así que dejamos respuestas armadas que atienden lo básico y llevan la charla a WhatsApp, que es donde se cierra la venta.',
          },
        ],
      },
    ],
  },

  condiciones: {
    pago: '100% por adelantado al inicio de cada mes.',
    duracion:
      'Recomendamos arrancar con 3 meses en cualquiera de los planes: es el tiempo mínimo para que una estrategia muestre resultados reales. No es obligatorio, se puede ir mes a mes.',
    ajuste:
      '10% cada 3 meses, avisado con 30 días. Pagando 3 meses adelantados congelás el precio y obtenés 5% de descuento.',
    revisiones: 'Dos rondas de ajustes por pieza, sin cargo.',
  },

  // Desde que la grabación entra en todos los planes, el cliente ya no
  // tiene que producir nada. Esta sección pasó de ser una lista de
  // obligaciones a ser argumento de venta: lo que le pedimos es poco.
  loQueNecesitamos: {
    items: [
      'Estar el día que vamos a grabar a tu local',
      'Aprobar el plan de contenido: son 10 minutos, una vez al mes',
      'Contarnos si tenés una promo o un lanzamiento',
      'Darnos acceso a tus redes, una sola vez',
    ],
    nota: 'De ahí en adelante no tenés que hacer nada más: pensamos, grabamos, editamos y publicamos nosotros.',
  },
};
