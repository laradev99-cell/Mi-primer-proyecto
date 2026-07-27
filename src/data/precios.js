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
        precio: 1380000,
      },
      {
        nombre: 'CRECIMIENTO',
        descripcion: '8 posteos + 26 historias',
        detalles: '4 reels · 4 carruseles',
        precio: 1760000,
      },
      {
        nombre: 'EXPANSIÓN',
        descripcion: '10 posteos + 34 historias',
        detalles: '5 reels · 5 carruseles',
        precio: 2200000,
      },
    ],
  },

  tiendaOnline: {
    nombre: 'Tienda sobre plataforma',
    bajada: 'Para salir a vender rápido, sobre plataformas probadas.',
    opciones: [
      { nombre: 'Mejoramos tu tienda actual', precio: 300000 },
      { nombre: 'Tienda Nube', precio: 450000 },
      { nombre: 'Shopify', precio: 500000 },
    ],
    nota: 'La plataforma y el dominio los paga el cliente directo al proveedor.',
  },

  desarrolloMedida: {
    nombre: 'Desarrollo a medida',
    bajada: 'Cuando una plataforma no alcanza.',
    descripcion:
      'Programamos desde cero, con código propio. El diseño no depende de una plantilla, las funciones no dependen de que exista una aplicación que las resuelva, y el código queda a tu nombre.',
    sirvePara: [
      'Tiendas y webs con diseño y funciones únicas',
      'Sistemas internos: stock, clientes, turnos, gastos, reportes',
      'Aplicaciones para celular',
    ],
    opciones: [
      { nombre: 'Web o tienda a medida', precio: null, nota: 'a definir' },
      {
        nombre: 'Sistemas y aplicaciones',
        precio: null,
        nota: 'cotización según proyecto',
      },
    ],
    aclaracion:
      'Cada proyecto se cotiza después de una charla: no es lo mismo una web de cinco secciones que un sistema con usuarios y stock.',
  },

  respuestasAutomaticas: {
    nombre: 'Respuestas automáticas con IA',
    descripcion:
      'La mayoría de los mensajes que recibe una tienda son siempre los mismos: precio, stock, envío, talle. Y cada uno que queda sin responder es una venta que se enfría.\n\nArmamos un asistente que conoce tu negocio y responde en Instagram y WhatsApp las 24 horas, con lenguaje natural. Te deriva solo las consultas que valen tu tiempo.',
    instalacion: null,
    mantenimiento: null,
    aclaracion:
      'El precio depende de cuántos canales conectemos y de qué tenga que saber el asistente. Lo cerramos en la reunión.',
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
      'Grabar el material que te pedimos y mandarlo antes del día 25',
      'Aprobar el plan de contenido dentro de las 72 horas',
      'Avisarnos lanzamientos o promos al comienzo de cada mes',
      'Darnos acceso a tus redes',
      'Estar en la reunión mensual',
    ],
    nota: 'Si vos cumplís esto, nosotros nos hacemos cargo de todo lo demás.',
  },
};
