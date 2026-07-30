---
name: panel-administracion-webhook
description: Los dos webhooks de revalidación (creados y verificados, 10 s de publicar a ver), el esquema exacto que acepta la API y cómo leer el log de entregas
metadata:
  type: project
---

**Los dos creados y funcionando (2026-07-30).** Al publicar en `/admin`, el cambio se ve en **unos 10
segundos** en los dos entornos, sin desplegar nada.

| Nombre            | URL                                             | Cómo se creó   |
| ----------------- | ----------------------------------------------- | -------------- |
| `revalidate-test` | `https://manfisatest.vercel.app/api/revalidate` | panel (a mano) |
| `revalidate-prod` | `https://manfisa.vercel.app/api/revalidate`     | Management API |

Ambos: dataset `production`, triggers create·update·delete, POST, API version `v2021-03-25`, sin
borradores, con el secreto de `SANITY_REVALIDATE_SECRET`. Es el máximo del plan (2 de 2).

## El esquema que la API SÍ acepta (esto es lo que costó)

`POST https://api.sanity.io/v2022-05-05/hooks/projects/{projectId}` → **201**. Tres detalles, y
fallar en cualquiera devuelve un 400 que parece decir otra cosa:

```jsonc
{
  "name": "revalidate-prod",
  "description": "…",
  "url": "https://…/api/revalidate",
  "dataset": "production",
  "type": "document",
  "rule": { "on": ["create", "update", "delete"] }, // 1. `on` va DENTRO de `rule`
  "apiVersion": "v2021-03-25",
  "httpMethod": "POST",
  "includeDrafts": false,
  "includeAllVersions": false,
  "headers": {},
  "secret": "…"
}
```

1. **`on` va dentro de `rule`**, no arriba. Con `on` arriba responde `"on" is not allowed`, que hace
   pensar que el endpoint no soporta triggers — y de ahí salió la conclusión equivocada de que la API
   no servía y había que usar el panel.
2. **`rule.filter` y `rule.projection` se OMITEN.** Mandarlos como `null` da
   `"rule.filter" must be a string`.
3. **`isDisabled` no se acepta al crear** (`"isDisabled" is not allowed`): los hooks nacen activos.

Ojo: el mismo POST contra `v2021-10-04` también funciona una vez la forma es correcta; lo que no
funcionaba era la forma, no la versión.

## Cómo comprobar que funciona (y el error que casi lo da por roto)

El log de entregas está en la API, no sólo en el panel:

```
GET https://api.sanity.io/v2021-10-04/hooks/projects/65pypeao/{hookId}/attempts
```

Devuelve `resultCode` y `resultBody` de cada entrega. Lo bueno es ver
`200` con `{"revalidated":true,"tag":"sanity-content"}`. Un **401** ahí significa que el secreto del
panel y el de `.env.local` no coinciden.

**El error que costó un rato:** la primera prueba de extremo a extremo pareció fallar (100 segundos
sin propagarse) y en realidad el webhook estaba entregando `200` desde el principio. El fallo era de
la prueba: se buscaba el texto del `claim` en `/es/company`, y **el `claim` sale en el Hero de la
PORTADA**; la página Empresa muestra `statement`. Moraleja: antes de declarar roto el webhook,
mirar `attempts` — si ahí hay 200, el problema está en lo que se está midiendo.

Para probarlo sin tocar contenido de verdad: modificar un campo, verificarlo en la página **donde ese
campo se pinta**, y revertirlo. El script usado está en el scratchpad de la sesión.

## Corrección: sí se puede automatizar (el primero se hizo a mano por un diagnóstico erróneo)

Durante un rato esta memoria afirmaba que la Management API «no soporta secretos» y que el webhook
había que crearlo obligatoriamente en el panel. **Era falso**, y conviene dejar escrito por qué se
llegó a esa conclusión:

- Al mandar `on` en la raíz del cuerpo, la API responde `"on" is not allowed`. De ahí se dedujo que el
  endpoint era una versión antigua sin soporte para triggers ni secretos. En realidad `on` sí existe,
  pero **anidado en `rule`** (ver el esquema de arriba). Los rechazos de `secret` y `httpMethod` de
  aquellos intentos venían de la misma causa: el cuerpo era inválido, y la validación va señalando
  campos de uno en uno, lo que da la impresión de un esquema mucho más pobre del que hay.
- Lección: cuando una API rechaza campos uno por uno, **leer el esquema del objeto que ya existe**
  (un `GET` del hook creado a mano lo daba servido: `rule: { on: [...] }`) en vez de ir probando por
  eliminación.

Lo que sí sigue siendo cierto: **`sanity hooks create` es interactivo** (`--help` sólo ofrece
`--project-id`), así que el CLI no sirve en un entorno sin TTY. Y **un hook sin secreto es peor que
no tener hook**: `app/api/revalidate/route.ts` usa `parseBody` de `next-sanity/webhook`, que verifica
la firma; sin secreto cada publicación daría **401** mientras el panel muestra el webhook en verde.
Por eso el secreto no es opcional.

## Si algún día se desactiva

La web es estática y se construye leyendo Sanity, así que sin webhook **el contenido publicado no
aparece hasta que hay un despliegue nuevo**. Para forzarlo: un push a `test` o un redeploy desde
Vercel.

Relacionado: [[panel-administracion]], [[despliegue-vercel]], [[seguridad-secretos]].
