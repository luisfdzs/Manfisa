# Manfisa — Web corporativa

Web de **Manfisa** (Manfisa Wire, S.L. / Manufacturas Irular, S.A.), fabricante de hilo de
aluminio trefilado en Irurtzun (Navarra) desde 1973: metalización, soldadura, aplicaciones
mecánicas, fundición y aplicaciones eléctricas.

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4, con **Sanity** como panel de
administración, trilingüe (es/en/fr) y desplegada en Vercel.

> **📁 Contexto del proyecto y skill `/retomar`**
> El contexto compartido (memoria, decisiones, convenciones) y la skill `/retomar` **no están
> en esta rama de código**: viven en la rama Git huérfana **`claude`**. Para consultarlos tras
> clonar:
>
> ```bash
> git checkout claude                          # o, para tenerlo junto al código:
> git worktree add ../manfisa-claude claude
> ```
>
> En esa rama, empieza con `/retomar` para ponerte al día.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # rellenar con los datos del proyecto de Sanity
npm run dev                  # http://localhost:3000
```

| Script                   | Qué hace                                                           |
| ------------------------ | ------------------------------------------------------------------ |
| `npm run dev`            | Servidor de desarrollo (Turbopack)                                 |
| `npm run build`          | Build de producción (prerrenderiza las 48 rutas)                   |
| `npm run check`          | `tsc --noEmit` + ESLint + Prettier — pasar esto antes de commitear |
| `npm run check:mobile`   | 26 comprobaciones en un Chrome real a 390×844 (ver más abajo)      |
| `npm run format`         | Aplica Prettier a todo el proyecto                                 |
| `npm run brand`          | Genera favicon, icono de iOS e imagen de compartir (OG)            |
| `npm run images`         | Descarga de manfisa.com las fotos del catálogo y las prepara       |
| `npm run migrate:sanity` | Carga el contenido inicial en Sanity (idempotente)                 |

## ⚠️ Antes de publicar en producción

La web está **completa a nivel técnico**, pero parte del contenido son valores plausibles del
sector, **no datos facilitados por Manfisa**. Están marcados uno por uno en la cabecera de
`scripts/migration/content-snapshot.mjs`. En resumen:

**Verificado** (manfisa.com, Informa D&B, Empresia, Infonif y el **BORME-C-2020-7534**, que es el
anuncio oficial de la segregación): CIF y fecha de constitución de la matriz (A31038839,
16/04/1973), la estructura societaria completa del grupo, plantilla (**46 personas**), facturación
(**> 30 M€**), dirección, CP, teléfono, fax, email y coordenadas, Dalian Manfisa (2008), los
**siete huertos solares** de Maizurgui Renovables y la energía 100 % renovable.

**Pendiente de validar por Manfisa:**

1. **Tablas de aleaciones** — designaciones, purezas, resistencias, alargamientos y diámetros.
2. **Formatos de suministro** — pesos de bobina y embalajes.
3. **Capacidad instalada** — las 3.500 t son la cifra que publica Electrolead, puesta como orden
   de magnitud. No es un dato de Manfisa.
4. **Certificaciones** — números y alcances de ISO 9001 / ISO 14001.
5. **Logotipo** — el wordmark y el favicon son un montaje tipográfico provisional
   (`components/layout/Wordmark.tsx`, `scripts/generate-brand-assets.mjs`).
6. **Fotografía** — ya no hay imágenes inventadas: todas son de manfisa.com (ver más abajo).
   Lo que falta son **originales a mayor resolución** de las fotos de formato.

No se ha inventado **ningún CIF** de las sociedades cuyo identificador no es público (el de Manfisa
Wire, entre ellos): un identificador oficial falso no es lo mismo que una especificación técnica
plausible, así que la web no muestra ninguno.

Hasta que 1-4 estén confirmados, la web debe quedarse en **test** (que emite `noindex`
automáticamente). Publicar una tabla de aleaciones inventada en una web industrial es peor que
no tener tabla: el primer cliente que pida esa aleación y no exista, no vuelve.

## Panel de administración (/admin)

El contenido **no está en el código**: vive en Sanity y se edita en **`/admin`**, dentro de la
propia web. Quien edita entra con su cuenta (invitada por email), no con una contraseña
compartida: se puede dar y quitar acceso persona a persona, cada cambio queda con autor y
fecha, y hay historial para deshacer.

Desde ahí se puede hacer **todo** sin tocar el repositorio:

- Crear, editar, borrar y **reordenar arrastrando** las líneas de producto. Ese orden es el de
  la web, y las marcadas como destacadas forman la portada — la primera es la que la abre a
  pantalla completa.
- Mantener las **tablas de aleaciones y de formatos de suministro** como tablas de verdad, con
  columnas: designación, pureza, resistencia, alargamiento, diámetros. No es texto libre, así
  que la web puede alinearlas por columnas y mañana se podrán filtrar o comparar.
- Subir **fichas técnicas y certificados en PDF**, que la web ofrece como descarga con su peso.
- Subir imágenes **del tamaño que sean**: la CDN de Sanity entrega a cada pantalla la versión
  ligera que necesita (ver `sanity/imageLoader.ts`).
- Editar todos los textos en **español, inglés y francés**, con los tres idiomas a la vista.
- Cambiar los datos de la empresa, las cifras, la historia, el grupo y el contacto («Empresa y
  contacto»), y toda la página de Calidad («Calidad»).

Al pulsar **Publicar**, Sanity avisa a `/api/revalidate` y la web se actualiza en segundos,
**sin desplegar nada**. Sigue siendo estática y servida desde el CDN.

Lo que **no** se puede tocar desde el panel, a propósito: el diseño. Las familias de producto
son una lista cerrada (la web tiene traducción preparada para cada valor en los tres idiomas) y
las descripciones son párrafos, no texto con formato libre, para que nadie pueda romper la
estética con un titular gigante.

### Puesta en marcha del panel

Ya está hecho: proyecto de Sanity **`65pypeao`**, dataset `production`, orígenes CORS, contenido
importado y **los dos webhooks de revalidación** (`revalidate-test` y `revalidate-prod`),
verificados de extremo a extremo: de pulsar «Publicar» a verlo en la web pasan unos 10 segundos.

Sólo queda **invitar a quien vaya a editar** en sanity.io/manage › Members.

> Si hay que recrear un webhook: `sanity hooks create` es interactivo y no sirve sin TTY, pero la
> Management API sí. `POST https://api.sanity.io/v2022-05-05/hooks/projects/{projectId}` con
> `rule: { on: [...] }` — **`on` va anidado, no en la raíz**; `rule.filter` y `rule.projection` se
> omiten (con `null` exige string) y `isDisabled` no se acepta al crear. El `secret` es
> obligatorio: sin él, `parseBody` devuelve 401 en cada publicación mientras el panel muestra el
> webhook en verde.

Los dos proyectos de Vercel (`manfisa` y `manfisatest`) están creados, conectados al repo, con las
tres variables en los tres entornos y con la **Production Branch ya correcta** (`main` y `test`
respectivamente). Ese ajuste tampoco lo expone el CLI, pero sí la API:
`PATCH /v9/projects/{id}/branch` con `{"branch":"test"}` — no `PATCH /v9/projects/{id}`, que
rechaza tanto `link` como `productionBranch` como propiedades no permitidas.

## Arquitectura

```
app/
  (site)/[locale]/       ← todas las páginas viven bajo idioma (/es, /en, /fr)
    layout.tsx           · fuentes, header/footer, metadata y hreflang
    page.tsx             · portada (hero a pantalla completa + líneas + cifras)
    products/            · índice agrupado por familia y ficha de línea [slug]
    quality/ company/ contact/
  (studio)/admin/        ← PANEL de administración (Sanity), con su propio layout raíz
  globals.css            ← SISTEMA DE DISEÑO: todos los tokens, y sólo aquí
  api/revalidate/        ← webhook: al publicar en el panel, la web se regenera
  sitemap.ts robots.ts   ← generados del contenido real
content/site.ts          ← sólo constantes técnicas; lo editorial vive en el panel
lib/
  content.ts             ← ÚNICA PUERTA de acceso al contenido, validado con zod
  i18n/ cn.ts site-env.ts
components/
  layout/ sections/ ui/
sanity/
  schemas/ queries.ts client.ts imageLoader.ts structure.ts
scripts/
  check-mobile.mjs          ← 26 comprobaciones en Chrome real (npm run check:mobile)
  generate-brand-assets.mjs ← favicon + OG desde la marca (npm run brand)
  source-images.mjs         ← QUÉ FOTO va en cada sitio, con su texto alternativo
  fetch-images.mjs          ← las descarga de manfisa.com y las prepara (npm run images)
  build-sanity-import.mjs   ← snapshot + fotos → NDJSON para sanity dataset import
  migration/content-snapshot.mjs ← CONTENIDO INICIAL, con el aviso de qué está sin validar
proxy.ts                 ← negocia el idioma y redirige / → /es | /en | /fr
                           (en Next 16 `middleware.ts` se llama `proxy.ts`)
```

Cinco decisiones que conviene entender antes de tocar código:

1. **Ninguna página consulta Sanity directamente**: todas pasan por `lib/content.ts`. Si mañana
   el catálogo viniera de un ERP, se cambia ese módulo y ninguna vista cambia.
2. **Todo es estático.** Las 48 rutas se prerrenderizan en build. Lo único que corre en el
   servidor es `proxy.ts`, que negocia el idioma, y el webhook de revalidación.
3. **Los tokens de diseño están sólo en `app/globals.css`.** Si un color o un espaciado no está
   en ese `@theme`, no se usa. Es lo que evita que la web se descuadre con el tiempo.
4. **Las imágenes se ponen siempre con `<Media>`** (`components/ui/Media.tsx`), nunca con
   `<Image>` suelto: centraliza dimensiones reales (CLS = 0), placeholder difuminado y `sizes`
   obligatorio. Sólo **una** imagen por página lleva `priority` — la del LCP.
5. **Las tablas técnicas usan la utilidad `spec-table`** y van dentro de un contenedor con
   `overflow-x: auto`. Es lo que permite que cinco columnas de datos quepan en un móvil sin que
   la página desborde. `npm run check:mobile` lo verifica.

## Imágenes

**Todas las fotografías salen de manfisa.com**, así que son producto real de la casa y no hay
duda de licencia ni de verosimilitud. `scripts/source-images.mjs` declara qué foto va en cada
sitio y con qué texto alternativo en los tres idiomas; `npm run images` las descarga y las pasa
a WebP, y la migración las sube a Sanity.

**No se usa stock, y fue una decisión, no un olvido.** Se buscó en Wikimedia Commons y
Openverse: lo poco relevante estaba en **CC BY-SA**, que impone atribución visible y
_share-alike_ sobre los recortes — una obligación permanente en una web corporativa a cambio de
una foto de relleno. Unsplash y Pexels sí permiten uso comercial sin atribución, pero exigen
clave de API para descargar de forma programática.

⚠️ **Limitación del material:** varias fotos de formato (`rollos_*`, `rosaceas_*`) sólo existen
en manfisa.com a **329×168 px**. Por eso ninguna se usa como portada —las portadas salen siempre
de las imágenes grandes— y la galería de la ficha va a **tres columnas**, donde no se amplían.
`fetch-images.mjs` nunca escala hacia arriba y avisa por consola de cuáles son pequeñas.

### El mosaico de portada

Lo primero que se ve es un mosaico de fotos de planta con movimiento lento, al modo del hero de
sanity.io. Se edita desde el panel («Empresa y contacto» › Mosaico de portada): entre tres y ocho
imágenes, y la primera ocupa la pieza grande.

**No es vídeo, a propósito.** Un hero en vídeo son megabytes compitiendo con el LCP y un autoplay
que en móvil falla a menudo. El movimiento se hace con un zoom lento por CSS (`montage-tile` en
`globals.css`) sobre imágenes que de todas formas hay que descargar: mismo efecto percibido, cero
peso añadido, y lo cambia cualquiera desde el panel porque son sólo imágenes. Se respeta
`prefers-reduced-motion`.

## Idiomas

Español, inglés y francés desde el primer día, en `/es`, `/en` y `/fr`. Los segmentos de ruta
son neutros (`/products`, `/quality`) y se centralizan en `lib/i18n/routes.ts`; si se quieren
slugs localizados (`/es/productos`) se resuelve ahí, sin tocar páginas. Los textos de interfaz
están en `lib/i18n/dictionaries.ts`: **si añades una clave y no la traduces a los tres idiomas,
falla el typecheck**. Con tres idiomas eso deja de ser un detalle — el francés es el que se
olvida.

El francés está aquí porque el mercado europeo de la metalización de film y papel está en
Francia, Italia y Alemania, y es el segundo idioma comercial real de la casa tras el inglés.

## Despliegue

Hospedado en **Vercel**, con dos entornos que se publican automáticamente al hacer _push_:

- **Producción:** rama `main` → proyecto `manfisa`.
- **Test:** rama `test` → proyecto `manfisatest`. Emite `noindex` y `robots: disallow`
  automáticamente para no competir en Google con el dominio real.

El criterio de indexación está en `lib/site-env.ts` y **no** puede basarse en `VERCEL_ENV`: el
proyecto de test despliega su rama como su propia "production", así que allí `VERCEL_ENV` es
`production` también. Se decide por `VERCEL_GIT_COMMIT_REF === 'main'`, y falla del lado seguro.

### 🔒 Candado de indexación: `SITE_INDEXABLE`

Las tres ramas están alineadas, así que la web **también vive en `main`** — pero cumplir la condición
de rama ya no basta: hace falta además `SITE_INDEXABLE=true` en el entorno. Sin esa variable, ni
siquiera producción se indexa.

Está para que alinear ramas no publique en Google especificaciones técnicas sin confirmar a nombre de
una empresa real. **Quitar el candado es la última tarea antes de salir a producción**, y se hace en
un sitio, sin tocar código: Vercel › proyecto `manfisa` › Settings › Environment Variables ›
`SITE_INDEXABLE=true` (entorno Production).

El framework se declara en **`vercel.json`** (`"framework": "nextjs"`), que se versiona y se
aplica igual a los dos entornos.

> ⚠️ **`vercel build` no funciona en Windows con este tipo de proyecto** (falla con
> `Unable to find lambda for route: /en/...`). Es un bug del builder `@vercel/next`: construye
> las claves de las funciones con `path.join` (que en Windows da `[locale]contact`) y luego las
> busca con `path.posix.join` (`/[locale]/contact`). En Linux coinciden. Para validar en local
> usa `npm run build`; para validar el despliegue, un preview real en Vercel.

## Antes de dar por cerrada una tarea

1. `npm run check` — typecheck, ESLint y Prettier.
2. `npm run check:mobile` con el servidor levantado. **Obligatorio si has tocado interfaz.** Ya
   ha encontrado tres fallos reales en este proyecto: la cabecera invisible sobre el hero (el
   `<header>` sticky ocupa su sitio en el flujo, así que el hero necesita un margen negativo
   para meterse debajo), las cifras de las tablas pegadas a la columna vecina, y el 404 del
   favicon. Cuando encuentres un fallo nuevo, añade su comprobación al script.
