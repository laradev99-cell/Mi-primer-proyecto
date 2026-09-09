# El panel

Está en **/panel**. Es privado: no se linkea desde ninguna página, no lo
indexa Google y no aparece en el menú. Se entra escribiendo la dirección.

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
| **Ajustes** | El dólar, los gastos fijos y la copia de seguridad. |

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

En el navegador donde los cargás. No hay servidor, no hay cuenta, no hay
nadie más que los vea — y tampoco se sincronizan solos entre la compu y el
celular.

Por eso, en Ajustes: **bajá la copia una vez por mes**. Ese archivo es el
respaldo y también la forma de pasar todo al celular ("Subir copia").

## En el celular

Se abre `/panel` en Chrome (Android) o Safari (iPhone) y se elige *Agregar a
la pantalla de inicio*. Queda con su icono, sin barra del navegador, y anda
sin señal.

## Para el que programe

- `src/pages/panel.astro` — el cascarón. Todo lo demás pasa en el navegador.
- `src/panel/estado.js` — los datos, las cuentas y la generación del mes.
- `src/panel/vistas/*.js` — una sección cada uno; devuelven HTML.
- `src/panel/ui.js` — formato de plata y la ventanita de formulario.
- `src/styles/panel.css` — el diseño del panel (el sitio público no lo usa).
- `public/sw.js` y `public/manifest.webmanifest` — lo que lo hace instalable.

Para revisarlo en un navegador de verdad, con datos de prueba y capturas:

```bash
npm run build
npx astro preview --port 4321     # en otra terminal
npm run revisar-panel -- /tmp/panel
```

Cuando el panel deje de alcanzar —porque haga falta entrar desde varios
lados a la vez o compartirlo con el equipo— el paso siguiente es mover
`estado.js` a una base de datos. El resto del código no se toca: todas las
vistas leen y escriben por ahí.
