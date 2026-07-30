# CHANGELOG — MANFISA

Historial automático del proyecto. Fecha en formato `AAAA-MM-DD`.

## 2026-07-30 (tarde) — Claude

**Datos reales del grupo, infraestructura terminada y rama de contexto publicada.**

- **Datos reales en lugar de inventados.** El **BORME-C-2020-7534** y los registros mercantiles
  (Empresia, Informa, Infonif) dieron mucho más de lo esperado: CIF y constitución de la matriz
  (A31038839, 16/04/1973), la **estructura societaria completa** (seis sociedades), **46 personas**,
  facturación **> 30 M€** y los **siete huertos solares** de Maizurgui Renovables. Hallazgo que
  cambia el contenido: **la soldadura es una empresa hermana** (Manfisa Welding Products, CIF
  B71407951, 17 empleados), no una línea de Manfisa Wire. Sólo quedan sin validar las tablas
  técnicas, los formatos de bobina, la capacidad y las certificaciones.
- **Ningún CIF inventado.** El de Manfisa Wire no es público y se dejó fuera: un identificador
  oficial falso no es equiparable a una especificación técnica plausible.
- **Production Branch corregida** en Vercel: `manfisa` → `main`, `manfisatest` → `test`. El endpoint
  bueno es `PATCH /v9/projects/{id}/branch`; documentado en `despliegue-vercel` junto con la trampa
  de que `POST …/link` devuelve 200 e ignora el campo.
- **Rama `claude` creada y subida** con `git worktree add --orphan`, en un worktree aparte para no
  tocar el árbol de código.
- **Webhook de revalidación creado y VERIFICADO.** No se pudo automatizar (el CLI es interactivo y la
  Management API que responde es la antigua, que rechaza `secret`), así que se rellenó el formulario
  del panel con el navegador; el campo del secreto lo pegó el usuario. Probado de extremo a extremo:
  publicar → **10 segundos** → visible en la web, y revertido igual. Nueva memoria
  `panel-administracion-webhook`.
- **Falso negativo en esa prueba, digno de recordar:** la primera pasada dio «no se propaga» tras 100
  segundos y el webhook llevaba todo el rato devolviendo `200`. Se estaba buscando el `claim` en
  `/es/company`, y el `claim` se pinta en el Hero de la **portada**. El log de entregas
  (`…/hooks/projects/{p}/{hookId}/attempts`) lo dejó claro en una consulta.
- **Incidencia:** el árbol de trabajo apareció en `main` a mitad de sesión (código borrado del
  disco). Se recuperó con `git checkout test`; nada se perdió porque ya estaba en `origin/test`.

## 2026-07-30 — Claude (con Luis Fernández Sangil)

**Arranque del proyecto: web corporativa trilingüe completa.**

- **Encargo:** «web para un negocio que es competencia directa de electrolead.co.in, con el stack,
  arquitectura y metodología de `sangilstudio` (rama test)». Se identificó que **Manfisa** (Irurtzun,
  Navarra) es ese competidor directo y de hecho el proveedor de referencia mundial en metalización,
  así que el trabajo es rehacer su web. Confirmado por el usuario, junto con **tres idiomas
  (es/en/fr)** y montar Sanity y Vercel desde el primer día.
- **Andamiaje:** Next.js 16 (App Router, Turbopack) + TypeScript estricto + Tailwind CSS 4 + zod +
  Sanity. Cinco plantillas (portada, productos, ficha de línea, calidad, empresa, contacto) × 3
  idiomas = **48 rutas prerrenderizadas**.
- **Modelo de contenido:** `productLine` (con aleaciones y formatos de suministro como **tablas con
  columnas de verdad**, no texto libre) + dos singletons, `companyInfo` y `qualityInfo`.
- **Sanity:** proyecto **`65pypeao`** creado, dataset `production`, 4 orígenes CORS, y contenido
  inicial importado (5 líneas de producto + empresa + calidad, en los tres idiomas).
- **Sistema de diseño «aluminio»:** tokens sólo en `app/globals.css`, IBM Plex Sans + Mono, y la
  utilidad `spec-table` para las tablas técnicas.
- **Verificación:** `scripts/check-mobile.mjs` ampliado a **26 comprobaciones** (incluidas las tablas
  anchas y los tres idiomas). Cazó tres fallos reales: cabecera invisible sobre el hero, cifras
  pegadas a la columna vecina y 404 del favicon. Los tres corregidos.
- **Contenido sin validar:** las tablas de aleaciones, los formatos, las cifras y las
  certificaciones son valores plausibles del sector, **no datos de Manfisa**. Marcados en
  `scripts/migration/content-snapshot.mjs`, en el README y en la memoria `pendientes-manfisa`. La web
  se queda en test hasta que los confirmen.
- **Vercel:** creados los dos proyectos (`manfisa` y `manfisatest`), conectados al repo y con las
  tres variables en production/preview/development.
- **Subido y desplegado** (a petición explícita del usuario, que es la excepción de
  `politica-commits`): `feature/web-foundation` → merge `--no-ff` en `test` → push; rama temporal
  borrada. **https://manfisatest.vercel.app** pasa **26/26** en `check:mobile` contra el despliegue
  real. Los dos proyectos están desplegando `test`, así que hay que corregir las Production Branch a
  mano (`manfisa` → `main`). La web salió con `noindex` en los dos, como debía: el criterio por rama
  de `lib/site-env.ts` hizo su trabajo.
- **La rama `claude` quedó sin crear:** el `git worktree add --orphan` lo bloqueó la política de
  permisos. El contexto está en el árbol de trabajo local, con los comandos dados al usuario.
- **Contexto:** creadas 15 memorias, la skill `/retomar` y este changelog. Tres trampas del
  importador de Sanity documentadas en `trampas-migracion-sanity` (el punto en el `_id` fue la que
  más costó: importa sin error y el documento no aparece en ninguna consulta).
- **Sin commitear** (memoria `politica-commits`): comandos propuestos al usuario.
