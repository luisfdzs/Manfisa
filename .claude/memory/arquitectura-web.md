---
name: arquitectura-web
description: Stack y patrones de la web — puerta única al contenido, estático primero, tokens sólo en globals.css, <Media>, spec-table y el margen negativo del hero
metadata:
  type: project
---

**Stack:** Next.js 16 (App Router, Turbopack) + TypeScript estricto + Tailwind CSS 4 + zod.
Trilingüe es/en/fr. **48 rutas prerrenderizadas** en build.

## Patrones que sostienen el proyecto

### 1. Puerta única al contenido (`lib/content.ts`)

Ninguna página consulta Sanity directamente. Todas pasan por ahí, y ahí se valida con zod. Si
mañana el catálogo viniera de un ERP, se cambia ese módulo y **ninguna vista cambia**.

Criterio de fallos, distinto según lo que falte:

- Una **línea de producto** incompleta se **descarta con aviso por consola**. La edita una persona
  desde el navegador y una línea a medio traducir no puede tumbar la web entera.
- **Empresa y contacto** incompleto **lanza error**: el teléfono y el email están en el pie de
  todas las páginas.
- **Calidad** incompleto devuelve `null` y la página responde **404**, no una página vacía.

Los esquemas trilingües se generan a partir de `locales` con el helper `localizedOf`, para que
añadir un idioma los actualice todos solos. Su tipo de retorno se **declara** en vez de dejarlo
inferir: de `Object.fromEntries` TypeScript sólo deduce claves `string`, y eso convertía cada
`texto[locale]` de las vistas en `T | undefined` — trece errores para expresar una duda que no
existe.

### 2. Estático primero

Todo se prerrenderiza. En servidor sólo corren `proxy.ts` (negocia idioma) y
`/api/revalidate` (webhook). `cacheComponents: true` en `next.config.ts` es lo que permite
etiquetar los datos del CMS con `use cache` + `cacheTag` y que el webhook los invalide.

⚠️ **Cache Components prohíbe `export const dynamic`** en cualquier ruta: el build falla con
«Route segment config "dynamic" is not compatible with nextConfig.cacheComponents». Se intentó en
la página del panel y hubo que quitarlo (no hacía falta: el panel es cliente).

⚠️ **Cache Components exige que `generateStaticParams` devuelva al menos un resultado.** Si el
dataset está vacío, el build falla con `EmptyGenerateStaticParamsError` — que es cómo se descubrió
el problema del punto en los `_id` (ver [[trampas-migracion-sanity]]).

⚠️ **Leer la hora actual en un componente de servidor está prohibido.** El año del copyright del
pie va encerrado en una función con `use cache` + `cacheLife('days')`.

### 3. Tokens sólo en `app/globals.css`

Si un color o un espaciado no está en ese `@theme`, no se usa. Ver [[diseno-web-referencias]].

### 4. Toda imagen pasa por `<Media>`

`components/ui/Media.tsx`, nunca un `<Image>` suelto: centraliza dimensiones reales (CLS = 0),
placeholder difuminado y `sizes` obligatorio. **Una sola imagen por página con `priority`** — la
del LCP. Las calidades permitidas están declaradas en `next.config.ts` (75 y 82): una no declarada
se redondea **en silencio**.

### 5. Tablas técnicas con `spec-table` + contenedor desplazable

La utilidad vive en `globals.css` y la tabla va **siempre** dentro de un `div` con
`overflow-x: auto`. Es lo que permite que cinco columnas de datos quepan en 390 px sin que la
PÁGINA desborde. `AlloyTable` además **omite las columnas opcionales que ninguna fila rellena**:
una columna «Resistencia» con seis guiones roba el ancho que necesitan las que sí tienen datos.

### 6. El hero necesita un margen negativo

`<header>` es `sticky top-0`, y **un elemento sticky ocupa su sitio en el flujo**. Sin
`-mt-20 md:-mt-24` en el hero, la foto empieza 80 px por debajo de la barra y el menú —que
mientras no se hace scroll se pinta en color metal sobre la foto— queda **metal sobre metal, es
decir invisible**. Los valores tienen que coincidir con la altura de la barra en `Header.tsx`.

Además el hero lleva **dos velos**, no uno: el de abajo para el titular y **el de arriba para la
cabecera**, porque una foto de planta clara por arriba se come el logotipo y los cinco enlaces.
Garantizar el contraste ahí sale más barato que exigir que todas las fotos sean oscuras: quien las
sube no tiene por qué saberlo.

## Rutas

Segmentos neutros centralizados en `lib/i18n/routes.ts`: `home`, `products` (+`[slug]`),
`quality`, `company`, `contact`. `href()` devuelve rutas **absolutas** — se añade la barra inicial
aparte porque metida en el array `filter(Boolean)` se la comía, devolvía `es/products` y desde una
página interior el navegador la encadenaba → 404. `check:mobile` lo verifica desde una ficha.

**Empresa y Calidad son páginas, no anclas de la portada**, al revés que en SANGIL STUDIO: en B2B
son las URLs que se citan en pliegos y auditorías. Ver [[encargo-y-competencia]].

Relacionado: [[diseno-web-referencias]], [[panel-administracion]], [[verificacion-y-despliegue]].
