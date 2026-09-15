# El panel

Es un link privado, aparte del sitio de Naimid: no vive en naimid.com.ar ni
en ningún dominio propio. Se publica como un **Artifact de Claude**, ligado
a la cuenta de Lara — nadie más puede abrirlo, verlo ni tocarlo.

Link actual: `https://claude.ai/artifact/6cSYcasKNrH3eGHoaVxZuX`

## Qué hace

Siete secciones, cada una con un trabajo puntual:

| Sección | Para qué |
|---|---|
| **Resumen** | El mes de un vistazo: cuánto facturaste, cuánto falta cobrar, cuánto te queda. Y arriba de todo, lo que está atrasado. |
| **Plata** | Cada cobro y cada pago, uno por uno. Acá se marca "ya me pagó" y "ya le pagué". Abajo, doce meses de historial. |
| **Clientes** | Quién te paga, cuánto, desde cuándo, y quién de tu equipo trabaja en cada uno. |
| **Equipo** | Tus cinco personas y cuánto le debés a cada una este mes. |
| **Trabajo** | Qué hay que entregarle a cada cliente este mes. La lista sale sola del plan que tiene contratado. |
| **Propuestas** | Lo que todavía no es cliente: quién te escribió, qué le cotizaste, en qué está. |
| **Ajustes** | El dólar, los gastos fijos y una copia de respaldo. |

## La parte que importa

El panel calcula **cuánto te queda a vos** porque sabe dos cosas: lo que te
paga cada cliente y lo que vos le pagás a tu equipo por ese cliente. Esa
segunda parte se carga desde la ficha del cliente, en "Quién trabaja acá".
Sin eso, el panel te dice cuánto facturás; con eso, te dice cuánto ganás.

## Cómo arranca cada mes

Solo. El primero de cada mes, para cada cliente activo, el panel crea:

- el cobro que corresponde, con la fecha en la que ese cliente paga;
- los pagos a la gente que trabaja en ese cliente;
- la lista de entregas del mes según su plan;
- los gastos fijos.

Todo nace en "pendiente". Vos solo vas marcando.

## Dónde viven los datos

En la nube, en la base de datos propia del panel (la capacidad `db` de los
Artifacts de Claude) — no en este navegador ni en este aparato. Por eso da
lo mismo abrirlo desde el celular o desde la compu: es el mismo lugar,
siempre al día, y si lo abrís en los dos a la vez, cada cambio aparece en
el otro solo.

**Es privado de verdad, no solo por el link.** El Artifact se publica con
reglas de acceso propias (`read: owner, write: owner`): ni compartiendo el
link ni dándole a alguien permiso de edición sobre el Artifact, esa persona
puede leer o escribir estos datos — solo la cuenta que lo publicó. Esto se
probó a mano antes de entregarlo: pedir los datos "como cualquier otra
persona" devuelve exactamente lo mismo que si el documento no existiera.

## En el celular

Se abre el link en Chrome (Android) o Safari (iPhone) y se elige *Agregar a
la pantalla de inicio*. Queda con su ícono, sin la barra del navegador — se
ve como una app.

## Copia de respaldo

En Ajustes, "Bajar copia" genera un `.json` con todo lo cargado. No hace
falta para que los datos no se pierdan —ya viven en la nube— pero es un
resguardo aparte, útil si alguna vez hace falta mover los datos a otro
lado. "Subir copia" hace el camino inverso: reemplaza todo lo que hay por
lo que traiga el archivo.

## Sobre WhatsApp

La idea de mandar información por WhatsApp y que quede cargada en el panel
**todavía no está construida.** Es un proyecto aparte, más grande: hace
falta un número de WhatsApp Business, un bot que entienda lo que se
escribe, y una forma de que ese bot escriba en esta misma base de datos —
que hoy solo es alcanzable desde adentro de este Artifact, no desde un
programa externo. Es el mismo tipo de trabajo que ya hace Agustín con "el
vendedor que nunca duerme"; conectarlo a este panel es el paso que falta
cuando se decida encararlo.

## Para el que programe

- `src/pages/panel.astro` — **no es una página del sitio**, es el cascarón
  que usa `astro build` para generar el CSS y el JS del panel ya
  empaquetados. Nunca se visita en naimid.com.ar.
- `src/panel/estado.js` — los datos, las cuentas, la generación del mes, y
  la conexión con la base (`iniciar`, `mutar`, `cargar`).
- `src/panel/vistas/*.js` — una sección cada uno; devuelven HTML.
- `src/panel/ui.js` — formato de plata y la ventanita de formulario.
- `src/styles/panel.css` — el diseño del panel (el sitio público no lo usa).
- `inline.cjs` — junta el build de Astro en un solo archivo HTML, en el
  formato que pide publicar un Artifact (sin `<html>`/`<head>`/`<body>`).

### Cómo publicar un cambio

```bash
npm run build
node inline.cjs panel/index.html /tmp/panel.html
```

Y publicar `/tmp/panel.html` como Artifact, actualizando la URL de arriba
(mismo link, no uno nuevo), con estas capacidades:

```json
{
  "db": { "rules": [{ "path": "", "read": "owner", "write": "owner" }] },
  "downloads": true
}
```

La regla de `db` es la que hace que sea privado de verdad — sin eso,
cualquier persona con el link podría leer y escribir los datos.

### Para probar en un navegador de verdad (sin la base)

Fuera del visor de Claude no existe `window.claude`, así que la base nunca
conecta: el panel muestra el aviso de "no se pudo conectar" a los 10
segundos. Sirve para revisar que no haya errores de JavaScript y que el
diseño se vea bien, pero no para probar altas, bajas ni cambios reales —
eso se prueba con las acciones `read_db` / `write_db` sobre el Artifact ya
publicado.

```bash
npm run build
npx astro preview --port 4321     # en otra terminal
npm run revisar-panel -- /tmp/panel
```

### El límite de tamaño

Toda la información vive en un único documento (256 KB como máximo). Un
negocio de este tamaño tarda años en acercarse a ese límite. Si algún día
pasa, el camino es partir `movimientos` y `entregas` en un documento por
año dentro de la misma base — ninguna pantalla tendría que cambiar para
eso, solo `estado.js`.
