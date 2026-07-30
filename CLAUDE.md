# CLAUDE.md — MANFISA · Web corporativa

> Contexto principal del proyecto. Este archivo se mantiene **actualizado automáticamente** en
> cada cambio relevante (ver la sección _Protocolo de mantenimiento_ al final). Es la fuente de
> verdad compartida por todos los desarrolladores que colaboran en el proyecto.

@.claude/memory/MEMORY.md

---

## 1. Qué es este proyecto

Web corporativa de **Manfisa**, fabricante de hilo de aluminio trefilado en Irurtzun (Navarra).
El objetivo es una web de catálogo industrial B2B: qué se fabrica, en qué aleaciones, en qué
formatos se entrega, cómo se controla la calidad y a quién llamar — en español, inglés y francés.

El encargo original fue «una web para un negocio que es competencia directa de
electrolead.co.in» (fabricante indio de hilo de aluminio de alta pureza para metalización, en
Pune). Manfisa **es** ese competidor directo, y de hecho el proveedor de referencia mundial en la
misma línea. Así que el trabajo no es inventar una empresa: es rehacer la web de Manfisa con el
stack y la metodología de SANGIL STUDIO.

**Estado actual (2026-07-30):** web **terminada a nivel técnico y verificada en local**
(`npm run check` y `npm run check:mobile` 26/26, `npm run build` con 48 rutas prerrenderizadas).
El panel de Sanity está creado (proyecto `65pypeao`) con el contenido inicial ya importado.
**Falta**: que el código se suba al repositorio (Claude no commitea, ver regla 3), los dos
proyectos de Vercel, el webhook de revalidación y —lo más importante— que **Manfisa valide los
datos técnicos** (ver sección 4 y la memoria `pendientes-manfisa`).

**Repositorio:** https://github.com/luisfdzs/Manfisa

## 2. Identidad de la empresa

- **Marca:** Manfisa.
- **Razón social:** Manfisa Wire, S.L. (fabrica el hilo de aluminio desde el 1-1-2021).
- **Matriz:** Manufacturas Irular, S.A. (fundada en 1973; hoy holding del grupo).
- **Grupo:** Manfisa Wire (aluminio) · Trefinasa (acero) · Manufacturas Irular (matriz, energía
  renovable y patrimonio). Además **Dalian Manfisa** (China, 2008).
- **Planta y oficinas:** Carretera Estella, 40 · 31860 Irurtzun · Navarra · España.
  Coordenadas 42.9161828, -1.8317235.
- **Contacto:** +34 948 500 206 · fax +34 948 500 725 · manfisa@manfisa.com
- **Líneas de producto:** metalización (la de referencia mundial), soldadura, aplicaciones
  mecánicas (remaches, grapas, clips), fundición y aplicaciones eléctricas.
- **Energía:** 100 % de origen renovable certificado (Axpo Iberia) + planta fotovoltaica de
  autoconsumo.

Detalle y fuentes en la memoria `identidad-manfisa`.

## 3. Stack técnico

- **Frontend:** **Next.js 16 (App Router, Turbopack) + TypeScript estricto + Tailwind CSS 4**,
  con `next/image` y **zod** validando el contenido. Web **trilingüe es/en/fr**, **estática**
  (48 rutas prerrenderizadas; en servidor sólo `proxy.ts`, que negocia el idioma, y el webhook
  de revalidación). Patrones en la memoria `arquitectura-web`.
- **Contenido: Sanity** (proyecto **`65pypeao`**, dataset `production`), que se edita en
  **`/admin`**. Al publicar, la web se regenera en segundos. Detalle en `panel-administracion`.
- **Hosting: Vercel**, dos proyectos (`manfisa` ← `main`, `manfisatest` ← `test`). El framework
  se declara en `vercel.json`. Sólo `main` se indexa: el criterio está en `lib/site-env.ts` y
  **no** puede basarse en `VERCEL_ENV`. Ver `despliegue-vercel`.
- **Calidad:** `npm run check` (typecheck + ESLint + Prettier) y `npm run check:mobile` (26
  comprobaciones en Chrome real) antes de cerrar cualquier tarea. Ver `verificacion-y-despliegue`.

## 4. ⚠️ Lo que NO está validado (crítico)

Buena parte del contenido técnico son **valores plausibles del sector, no datos facilitados por
Manfisa**: tablas de aleaciones, pesos de bobina, cifras de capacidad y facturación, y números
de certificación. Están marcados uno por uno en la cabecera de
`scripts/migration/content-snapshot.mjs` y resumidos en el README.

**Hasta que Manfisa los confirme, la web se queda en el entorno de TEST** (que emite `noindex`
automáticamente). El logotipo, el favicon y las fotos de catálogo también son provisionales y
están marcados como tales. Detalle en la memoria `pendientes-manfisa`.

## 5. Estructura de carpetas

En la **rama de código** (`test` y ramas temporales):

```
Manfisa/
├── app/(site)/[locale]/    ← páginas: portada, products (+[slug]), quality, company, contact
├── app/(studio)/admin/     ← PANEL de administración (Sanity), con su propio layout raíz
├── app/globals.css         ← SISTEMA DE DISEÑO: todos los tokens, y sólo aquí
├── app/api/revalidate/     ← webhook: al publicar en el panel, la web se regenera
├── components/             ← layout/ · sections/ (Hero, LineCard, Figures, AlloyTable,
│                             SupplyTable, DocumentList, Prose) · ui/ (Media, Reveal)
├── sanity/                 ← esquemas del panel, consultas GROQ, cliente, cargador de imágenes
├── content/site.ts         ← sólo constantes técnicas; lo editorial vive en el panel
├── lib/                    ← content.ts (puerta única) · site-env.ts · cn.ts · i18n/
├── scripts/                ← check-mobile · generate-brand-assets · generate-placeholders
│                             · build-sanity-import + migration/content-snapshot.mjs
├── vercel.json             ← declara el framework (nextjs) para los dos entornos
└── proxy.ts                ← negocia idioma y redirige / → /es | /en | /fr
```

En la **rama `claude`** (contexto, huérfana): `CLAUDE.md` + `.claude/` (`memory/`,
`auto-memory/`, `skills/retomar/`, `settings.local.json`) + `.gitignore`.

## 6. Sistema de memoria y contexto

Todo el contexto vive **a nivel de proyecto** dentro de `.claude/`:

- **Memorias normales** (`.claude/memory/`): hechos curados y estables. Índice en `MEMORY.md`,
  que este `CLAUDE.md` importa arriba con `@`.
- **Auto-memorias** (`.claude/auto-memory/`): registro automático — sesiones, `INDEX.md` y
  `CHANGELOG.md`.
- **Skill `/retomar`**: recupera el estado del proyecto leyendo `CLAUDE.md`, las memorias y el
  changelog.

## 7. Reglas del proyecto (para todo el equipo)

1. **Contexto siempre a nivel de proyecto, nada global** — memorias, skills y reglas se guardan
   dentro de `.claude/`, nunca en el directorio global. (`convenciones-mantenimiento`)
2. **Nunca subir secretos** — credenciales, keys, tokens y variables `.env` jamás se sincronizan
   con GitHub; al añadir uno nuevo se incluye en `.gitignore` antes de subir.
   (`seguridad-secretos`)
3. **Claude nunca hace commit ni push** — modifica los ficheros y **propone un mensaje de commit
   CORTO y en inglés**; el usuario revisa y ejecuta. (`politica-commits`)
4. **Sincronizar antes de trabajar** — `fetch`/`pull` antes de empezar. (`flujo-git-y-ramas`)
5. **Rama por tarea, y la rama se BORRA al mergear** — sacada de `test`, `git merge --no-ff` de
   vuelta, y `git branch -d` + `git push origin --delete`. **Nunca squash** en las promociones
   `test` → `develop` → `main`. (`flujo-git-y-ramas`)
6. **Rama `claude` de contexto (inviolable)** — **NUNCA se fusiona** y **NUNCA se elimina**.
   (`flujo-git-y-ramas`)
7. **Una tarea de interfaz no está hecha hasta verla en móvil** — `npm run check:mobile`.
   (`verificacion-y-despliegue`)
8. **Los despliegues se validan con un preview real de Vercel**, nunca con `vercel build` en
   local: en Windows falla siempre por un bug del builder. (`verificacion-y-despliegue`)
9. **Ningún dato técnico se publica sin que Manfisa lo confirme.** (`pendientes-manfisa`)

### Modelo de ramas

`main` (producción) · `develop` (lo que va a producción) · `test` (día a día) · ramas temporales
(nacen y **mueren** en `test`) · `claude` (contexto, huérfana).

### Cuenta Git/GitHub

La **única** cuenta que interactúa con GitHub en este repo es la personal **`luisfdzs`**
(`luisfsangil@gmail.com`), vía **GitHub CLI (`gh`)**. La cuenta del trabajo
(`lfernandezs@mobilesmart.city`) **nunca** se usa aquí. Sanity y Vercel están autenticados con la
misma cuenta personal.

## 8. Protocolo de mantenimiento (IMPORTANTE)

En **cada cambio relevante**, Claude debe, sin que se lo pidan:

1. **Actualizar las memorias** afectadas en `.claude/memory/` (y su índice `MEMORY.md`).
2. **Registrar una auto-memoria** de sesión en `.claude/auto-memory/` y añadir entrada al
   **`CHANGELOG.md`** con fecha (`AAAA-MM-DD`), autor y resumen.
3. **Actualizar este `CLAUDE.md`** si el cambio afecta a estructura, stack, estado o convenciones.
4. **Proponer** el commit/push del contexto a la rama `claude` (lo ejecuta el usuario, regla 3).

Regla de oro: **el contexto nunca debe quedar desactualizado respecto al estado real del
proyecto.**

---

_Última actualización: 2026-07-30 — arranque del proyecto: web trilingüe completa, panel de
Sanity `65pypeao` con contenido importado, 26/26 en la verificación móvil. Pendiente de subir al
repo y de que Manfisa valide los datos técnicos._
