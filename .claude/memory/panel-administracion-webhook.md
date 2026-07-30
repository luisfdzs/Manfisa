---
name: panel-administracion-webhook
description: El webhook de revalidación de Sanity hay que crearlo a mano en el panel — por qué no se puede automatizar ni con el CLI ni con la Management API
metadata:
  type: project
---

El webhook que avisa a `/api/revalidate` al publicar **no está creado**, y hay que hacerlo a mano en
**sanity.io/manage › API › Webhooks**:

| Campo    | Valor                                                |
| -------- | ---------------------------------------------------- |
| URL      | `https://manfisatest.vercel.app/api/revalidate`      |
| Dataset  | `production`                                         |
| Trigger  | create · update · delete                             |
| Método   | POST                                                 |
| Secret   | el de `SANITY_REVALIDATE_SECRET` (está en `.env.local`) |

## Por qué no se puede automatizar (comprobado 2026-07-30)

Se intentaron las dos vías y ninguna sirve:

1. **`sanity hooks create` es interactivo.** No acepta flags para URL, dataset ni secreto
   (`--help` sólo ofrece `--project-id`), así que en un entorno sin TTY no hay forma de pasarle los
   datos.
2. **El endpoint de la Management API que responde para este proyecto es el ANTIGUO.** Las tres rutas
   `/{v1,v2021-10-04,v2022-05-05}/hooks/projects/65pypeao` devuelven 200 y la misma lista, y su
   esquema **rechaza `secret`, `on`, `httpMethod`, `apiVersion` e `includeDrafts`** («is not
   allowed»). Es decir: por ahí sólo se puede crear un hook **sin secreto**.

Y un hook sin secreto es **peor que no tener hook**: `app/api/revalidate/route.ts` usa `parseBody` de
`next-sanity/webhook`, que verifica la firma. Sin secreto no hay firma válida, así que cada
publicación recibiría un **401** y la web no se regeneraría — con el añadido de que en el panel el
webhook aparecería en verde como «creado». Un fallo silencioso a cambio de ahorrar treinta segundos
de formulario.

## Mientras no exista

La web es estática y se construye leyendo Sanity, así que **el contenido publicado no aparece hasta
que hay un despliegue nuevo**. Para forzarlo: un push a `test` (o un redeploy desde Vercel). Es
exactamente lo que el webhook viene a evitar, y la razón por la que conviene crearlo pronto.

Relacionado: [[panel-administracion]], [[despliegue-vercel]], [[seguridad-secretos]].
