---
name: despliegue-vercel
description: Dos proyectos de Vercel (prod ← main, test ← test) y por qué la indexación no puede depender de VERCEL_ENV
metadata:
  type: project
---

Hospedaje en **Vercel**, cuenta personal (`luisfsangil-9858`), con **dos proyectos** vinculados al
mismo repo que redespliegan solos con cada push:

- **Producción:** proyecto `manfisa`, rama **`main`**.
- **Test:** proyecto `manfisatest`, rama **`test`**.

**Estado (2026-07-30):** los dos proyectos están creados, conectados al repo `luisfdzs/Manfisa`, con
las tres variables en production/preview/development, y **ya desplegados**:

- **https://manfisatest.vercel.app** — verificado con `BASE=… npm run check:mobile`: **26/26**.
- **https://manfisa.vercel.app** — también sirve la web.

## Cómo se cambia la Production Branch (el CLI no puede)

`vercel project` no tiene comando para esto y `PATCH /v9/projects/{id}` **rechaza** tanto `link`
como `productionBranch` («should NOT have additional property»). El endpoint que funciona es uno
aparte, y no es evidente:

```
PATCH https://api.vercel.com/v9/projects/{projectId}/branch
{ "branch": "test" }
```

`POST /v9/projects/{id}/link` devuelve 200 pero **ignora** el `productionBranch` que le pases: es la
trampa que hace perder el rato.

Estado actual: **`manfisa` → `main`**, **`manfisatest` → `test`** (corregido el 2026-07-30).

⚠️ **Ojo con el primer despliegue de un proyecto nuevo.** Al conectar el repo, los dos proyectos
tenían `productionBranch: "main"` y aun así **ambos desplegaron `ref=test` como `target: production`**
(`sha=2c8dc01`). Vercel promociona el primer despliegue de un proyecto sin producción previa. Efecto
práctico: `manfisa.vercel.app` está sirviendo un build de `test`. No es urgente porque salió
`noindex`, y se resolverá solo en cuanto `main` reciba la promoción de verdad; si molesta antes,
`vercel remove` ese despliegue.

**La red de seguridad funcionó.** Aunque `manfisa` desplegó en `target: production`, la web salió con
`noindex` y `Disallow: /` porque el criterio es `VERCEL_GIT_COMMIT_REF === 'main'` y el ref era
`test`. Es exactamente el fallo que este diseño evita: si el criterio hubiera sido `VERCEL_ENV`, la
web habría quedado **indexable en producción con datos técnicos sin validar**.

⚠️ Las URLs `*-luis-fernandez.vercel.app` de cada deployment están detrás del **SSO de Vercel**
(Deployment Protection por defecto), así que devuelven 302 a `vercel.com/sso-api` si se piden sin
sesión. Para comprobar cosas desde fuera hay que usar los dominios canónicos
(`manfisatest.vercel.app`), no la URL del deployment.

El framework se declara en **`vercel.json`** (`"framework": "nextjs"`), que se versiona y manda
sobre el ajuste del panel, así que se aplica igual a los dos entornos sin tocar nada a mano.

## La indexación se decide por RAMA, no por `VERCEL_ENV`

Es el detalle que hay que entender antes de tocar `lib/site-env.ts`.

El proyecto de test despliega la rama `test` **como su propio entorno de producción**: allí
`VERCEL_ENV === 'production'` **también**. Si el criterio fuera esa variable, el entorno de pruebas
saldría con `index, follow` y `Allow: /`, compitiendo en Google con el dominio real por el mismo
contenido. En B2B, donde el tráfico de marca es casi todo el tráfico, duplicar la web es regalarle
a un competidor el primer resultado.

Se decide con `VERCEL_ENV === 'production' && VERCEL_GIT_COMMIT_REF === 'main'`:

```
proyecto `manfisa`      rama `main`  → indexable
proyecto `manfisatest`  rama `test`  → NO indexable
previews de cualquier rama           → NO indexable
desarrollo local (sin variables)     → NO indexable
```

**Falla del lado seguro:** si mañana falta la variable, no se indexa. `/admin` queda excluido
siempre, incluso en producción.

`npm run check:mobile` comprueba que cualquier entorno que no sea el dominio real emite `noindex`.

## Variables de entorno

Las mismas cuatro de `.env.local` tienen que estar en **los dos** proyectos (`vercel env add`):
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_WRITE_TOKEN` (vacío) y
`SANITY_REVALIDATE_SECRET`. Nunca se suben al repo: ver [[seguridad-secretos]].

## ⚠️ `vercel build` no funciona en Windows

Falla con `Unable to find lambda for route: /en/...`. Es un bug del builder `@vercel/next`:
construye las claves de las funciones con `path.join` (que en Windows da `[locale]contact`) y luego
las busca con `path.posix.join` (`/[locale]/contact`). En Linux coinciden. **Para validar en local,
`npm run build`; para validar el despliegue, un preview real.** Ver
[[verificacion-y-despliegue]].

Relacionado: [[verificacion-y-despliegue]], [[pendientes-manfisa]], [[seguridad-secretos]].
