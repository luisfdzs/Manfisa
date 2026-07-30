---
name: limite-despliegues-vercel
description: El plan gratuito de Vercel corta a 100 despliegues por día y este proyecto los gasta al doble de velocidad; cómo se manifiesta (push sin build, sin aviso) y cómo evitarlo
metadata:
  type: project
---

**El plan Hobby corta en 100 despliegues por día.** Se agotó el 2026-07-30 y el síntoma es
traicionero: los `git push` se completan sin error, las ramas quedan correctas en GitHub y
**simplemente no aparece ningún build**. No hay aviso en el repo ni en el CLI. El límite sólo se ve
al intentar crear un despliegue por API:

```
402 payment_required — Resource is limited - try again in 1 day
(more than 100, code: "api-deployments-free-per-day")
```

La ventana se reinicia unas 24 h después del primer despliegue del bloque.

## Por qué se gasta el doble de rápido aquí

**Los dos proyectos están conectados al mismo repositorio**, así que **cada push construye DOS
veces**: producción o preview en `manfisa` y lo propio en `manfisatest`. Y promocionar toca tres
ramas (`test` → `develop` → `main`), o sea **seis despliegues por promoción completa**.

Súmese que al principio la rama `claude` también construía los dos proyectos en cada commit de
contexto (arreglado con un `vercel.json` en esa rama — ver [[despliegue-vercel]]).

## Cómo evitarlo

- **No promocionar a `develop` y `main` en cada iteración.** Mientras se está afinando algo, trabajar
  contra `test` y promocionar una sola vez cuando esté cerrado. Cada promoción cuesta seis.
- Para revisar cambios, **el servidor local** (`npm run dev`) y `npm run check:mobile` contra
  `localhost` — que es lo que ya manda la metodología. El preview real se reserva para validar el
  despliegue, no para mirar el diseño.
- Si hace falta forzar un build cuando la cuota lo permita:

  ```
  POST https://api.vercel.com/v13/deployments?forceNew=1
  { "name": "manfisa", "project": "<projectId>", "target": "production",
    "gitSource": { "type": "github", "repoId": <repoId>, "ref": "main" } }
  ```

## Consecuencia práctica de haberlo agotado

El código puede estar mergeado y empujado en las tres ramas y **los dominios seguir sirviendo el
build anterior**. Pasó con el muro de portada: `test`, `develop` y `main` correctas en origin, y
`manfisa.vercel.app` y `manfisatest.vercel.app` mostrando todavía el hero antiguo. Al reponerse la
cuota hay que **relanzar el despliegue a mano**: no se recupera solo, porque los eventos de push que
se descartaron no vuelven.

Relacionado: [[despliegue-vercel]], [[verificacion-y-despliegue]].
