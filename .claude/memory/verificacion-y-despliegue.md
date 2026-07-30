---
name: verificacion-y-despliegue
description: Dos reglas — una tarea de interfaz no está hecha hasta pasar check:mobile; los despliegues se validan con preview real, nunca con vercel build en Windows
metadata:
  type: feedback
---

## Regla 1 — una tarea de interfaz no está hecha hasta verla en móvil

Antes de cerrar cualquier tarea que toque interfaz: **`npm run check:mobile`** con el servidor
levantado. Son 26 comprobaciones en un **Chrome real a 390×844**, no un test unitario: es la lista
de cosas que en una web así se rompen siempre.

**Why:** los tres fallos que ya ha cazado en este proyecto eran **invisibles a 1440 px**:

1. **La cabecera invisible sobre el hero.** `<header>` es `sticky top-0`, y un elemento sticky ocupa
   su sitio en el flujo: el hero empezaba 80 px por debajo y el menú, que se pinta en color metal
   sobre la foto, quedaba metal sobre metal. Se arregló con un margen negativo en el hero. A 1440 px
   no salta a la vista porque el ojo ya sabe dónde está el menú.
2. **Las cifras de las tablas pegadas a la columna vecina** («1,50 – 3,00 mmMáxima pureza»,
   «PESOEMBALAJE»), por poner a cero el `padding-right` de las celdas numéricas.
3. **404 del favicon** en cada carga, por no haber generado los assets de marca (`npm run brand`).

**How to apply:** con el servidor en marcha, `npm run check:mobile` (o
`BASE=https://manfisatest.vercel.app npm run check:mobile`). Debe dar **26/26**. **Cuando encuentres
un fallo nuevo, añade su comprobación al script** — es lo que hace que la lista sirva de algo.

Lo que vigila: desbordamiento horizontal en las cinco plantillas, que **las tablas anchas desborden
dentro de su contenedor y no arrastren la página**, el menú móvil completo (apertura, altura real,
bloqueo de scroll, color de barra, Escape, cierre al navegar), enlaces absolutos medidos **desde una
ficha profunda**, áreas pulsables de 24 px (WCAG 2.2), que los **tres idiomas** respondan 200 con su
`lang` correcto, `noindex` fuera de producción y ausencia de errores de consola.

## Regla 2 — los despliegues se validan con un preview real, nunca con `vercel build`

**Why:** `vercel build` **falla siempre en Windows** con este tipo de proyecto
(`Unable to find lambda for route: /en/...`), y es un bug del builder, no de la web. Ver el detalle
en [[despliegue-vercel]].

**How to apply:** en local, `npm run build` (que sí funciona y prerrenderiza las 48 rutas). Para
validar el despliegue, un **preview real de Vercel**.

## Orden al cerrar una tarea

1. `npm run check` — typecheck + ESLint + Prettier.
2. `npm run check:mobile` — si has tocado interfaz.
3. `npm run build` — si has tocado rutas, contenido o configuración.
4. Proponer el commit (ver [[politica-commits]]) y actualizar el contexto (ver
   [[convenciones-mantenimiento]]).

Relacionado: [[despliegue-vercel]], [[arquitectura-web]], [[politica-commits]].
