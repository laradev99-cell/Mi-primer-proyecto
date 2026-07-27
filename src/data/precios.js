// Precios de Naimid.Agency
// Actualizar cada 3 meses (enero, abril, julio, octubre)

export const precios = {
  analisisEstrategia: {
    nombre: "Análisis y estrategia",
    bajada: "Antes de publicar, entendemos.",
    precio: 150000,
    moneda: "ARS",
    incluye: [
      "Briefing y diagnóstico de tu marca",
      "Análisis de lo que veniste haciendo",
      "Definición de tus pilares de contenido",
      "Plan estratégico a 3 meses",
      "Tu Kit de Grabación personalizado",
      "Reunión de presentación"
    ],
    frecuencia: "Pago único. Se repite cada 3 meses para recalibrar el rumbo."
  },
  manejoRedes: {
    nombre: "Manejo de redes",
    bajada: "Los tres planes incluyen lo mismo. Cambia el volumen.",
    incluye: [
      "Ideas y plan de contenido mensual",
      "Diseño y edición de cada pieza",
      "Textos escritos para vender",
      "Publicación en Instagram y Facebook",
      "Kit de Grabación mensual",
      "Reporte mensual de resultados",
      "Reunión mensual"
    ],
    planes: [
      {
        nombre: "PRESENCIA",
        descripcion: "6 posteos + 18 historias",
        detalles: "3 reels · 3 carruseles",
        precio: 1380000,
        moneda: "ARS"
      },
      {
        nombre: "CRECIMIENTO",
        descripcion: "8 posteos + 26 historias",
        detalles: "4 reels · 4 carruseles",
        precio: 1760000,
        moneda: "ARS"
      },
      {
        nombre: "EXPANSIÓN",
        descripcion: "10 posteos + 34 historias",
        detalles: "5 reels · 5 carruseles",
        precio: 2200000,
        moneda: "ARS"
      }
    ]
  },
  tiendaOnline: {
    nombre: "Tienda online",
    bajada: "Para salir a vender rápido, sobre plataformas probadas.",
    opciones: [
      {
        nombre: "Mejoramos tu tienda actual",
        precioDesde: 300000,
        moneda: "ARS"
      },
      {
        nombre: "Tienda Nube",
        precioDesde: 450000,
        moneda: "ARS"
      },
      {
        nombre: "Shopify",
        precioDesde: 500000,
        moneda: "ARS"
      }
    ],
    nota: "La plataforma y el dominio los paga el cliente directo al proveedor."
  },
  desarrolloMedida: {
    nombre: "Desarrollo a medida",
    bajada: "Cuando una plataforma no alcanza.",
    descripcion: "Programamos desde cero, con código propio. El diseño no depende de una plantilla, las funciones no dependen de que exista una aplicación que las resuelva, y el código queda a tu nombre.",
    sirveParaItem1: "Tiendas y webs con diseño y funciones únicas",
    sirveParaItem2: "Sistemas internos: stock, clientes, turnos, gastos, reportes",
    sirveParaItem3: "Aplicaciones para celular",
    opciones: [
      {
        nombre: "Web o tienda a medida",
        precioDesde: 2900000,
        moneda: "ARS"
      },
      {
        nombre: "Sistemas y aplicaciones",
        precioDesde: null,
        nota: "cotización según proyecto"
      }
    ]
  },
  respuestasAutomaticas: {
    nombre: "Respuestas automáticas con IA",
    descripcion: "La mayoría de los mensajes que recibe una tienda son siempre los mismos: precio, stock, envío, talle. Y cada uno que queda sin responder es una venta que se enfría.\n\nArmamos un asistente que conoce tu negocio y responde en Instagram y WhatsApp las 24 horas, con lenguaje natural. Te deriva solo las consultas que valen tu tiempo.",
    instalacion: 625000,
    mantenimiento: 100000,
    moneda: "ARS"
  },
  condiciones: {
    pago: "100% por adelantado al inicio de cada mes.",
    duracion: "El trabajo se contrata por 3 meses. Es el tiempo mínimo para que una estrategia muestre resultados reales. Cumplido ese plazo, seguimos mes a mes.",
    ajuste: "10% cada 3 meses, avisado con 30 días. Pagando 3 meses adelantados congelás el precio y obtenés 5% de descuento.",
    revisiones: "Una ronda de ajustes por pieza, sin cargo."
  },
  loQueNecesitamos: {
    item1: "Grabar el material del Kit y mandarlo antes del día 25",
    item2: "Aprobar el plan de contenido dentro de las 72 horas",
    item3: "Avisarnos lanzamientos o promos con 15 días de anticipación",
    item4: "Darnos acceso a tus redes",
    item5: "Estar en la reunión mensual",
    nota: "Si vos cumplís esto, nosotros nos hacemos cargo de todo lo demás."
  }
};
