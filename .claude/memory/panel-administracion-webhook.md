---
name: panel-administracion-webhook
description: El webhook de revalidación (creado y verificado, 10 s de publicar a ver) — por qué hubo que crearlo a mano y cómo se comprueba que funciona de verdad
metadata:
  type: project
---

**Creado y funcionando (2026-07-30).** Al publicar en `/admin`, el cambio se ve en la web en **unos
10 segundos**, sin desplegar nada. Configuración, en sanity.io/manage › API › Webhooks:

| Campo       | Valor                                                   |
| ----------- | ------------------------------------------------------- |
| Nombre / id | `revalidate-test` / `MAmWRdflnd5sR8vn`                  |
| URL         | `https://manfisatest.vercel.app/api/revalidate`         |
| Dataset     | `production`                                            |
| Trigger     | create · update · delete                                |
| Método      | POST · API version `v2021-03-25` · sin borradores       |
| Secret      | el de `SANITY_REVALIDATE_SECRET` (está en `.env.local`) |

⚠️ **Falta el de producción.** Cuando `main` reciba la web, hay que crear el gemelo apuntando al
dominio real. El plan admite 2 webhooks.

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

## Si algún día se desactiva

La web es estática y se construye leyendo Sanity, así que sin webhook **el contenido publicado no
aparece hasta que hay un despliegue nuevo**. Para forzarlo: un push a `test` o un redeploy desde
Vercel.

Relacionado: [[panel-administracion]], [[despliegue-vercel]], [[seguridad-secretos]].
