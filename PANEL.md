# El panel

Esto cambió de arquitectura dos veces. Lo que importa hoy:

## Lo que está en uso

Las finanzas y la operación del día a día de Naimid viven en **Eureka**, el
asistente de WhatsApp que ya tenía Lara (lo armó su hermano). Clientes,
cobros, pagos al equipo, entregas y recordatorios se cargan ahí, hablando
normal — no hay nada que mantener en este repositorio para eso.

Lo único que vive afuera de Eureka es **El Mirador de Naimid**
(`https://claude.ai/artifact/6cSYcasKNrH3eGHoaVxZuX`), un Artifact de Claude
privado que lee esos mismos datos en vivo (vía la capacidad `mcp`,
conectada al conector "Eureka") y los muestra visualmente: resumen del mes,
un calendario con los días de cobro y entrega (navegable, con detalle
completo al tocar un día), la lista de clientes y del equipo. No guarda
nada por su cuenta — es una ventana, no una base de datos aparte.

El código fuente vive en `mirador/mirador.html`, en este mismo
repositorio, solo para tenerlo versionado — Astro no lo toca, no es una
página del sitio. Para publicar un cambio: editar ese archivo y pasarlo al
tool `Artifact` con la misma URL de arriba.

## Lo que quedó retirado

Hubo un primer intento, construido en `src/panel/` dentro de este repo:
un panel con su propia base de datos (la capacidad `db` de los Artifacts),
pensado para reemplazar una planilla. Se abandonó porque Lara ya tenía
Eureka funcionando con datos reales y no tenía sentido mantener dos
sistemas en paralelo. Ese código se borró de este repositorio — si hace
falta repasar cómo estaba armado, está en el historial de git, en los
commits previos a este.

## Si en algún momento hay que tocar el Mirador

No es parte del build de Astro: es un archivo HTML autocontenido (sin
`<html>`/`<head>`/`<body>` propios, con solo `<title>` y `<style>` al
principio, como pide el tool `Artifact`), con su propio JavaScript que
llama a las herramientas de Eureka a través de `window.claude.use('mcp')`.
Ver `watchTool` para las lecturas (se actualizan solas) — no hay escritura
desde el Mirador por ahora, es de solo lectura a propósito.
