---
name: panel-administracion
description: Sanity en /admin — proyecto 65pypeao, modelo de contenido (líneas de producto + dos singletons) y qué puede editar Manfisa
metadata:
  type: project
---

El contenido no está en el código: vive en **Sanity** y se edita en **`/admin`**, dentro de la
propia web.

## Datos del proyecto

- **Project ID: `65pypeao`** · dataset **`production`** (público en lectura).
- Creado el 2026-07-30 con la cuenta personal (`luisfsangil@gmail.com`).
- Panel: https://www.sanity.io/manage/project/65pypeao
- **Orígenes CORS** dados de alta (con credenciales): `http://localhost:3000`,
  `https://manfisa.vercel.app`, `https://manfisatest.vercel.app`, `https://www.manfisa.com`.
- **No hay token de escritura.** No hace falta: la migración usa la sesión de `sanity login` y la
  web sólo lee.

## Modelo de contenido

Tres tipos de documento, ni uno más:

1. **`productLine`** (línea de producto) — el único tipo de catálogo. Agrupa las **aleaciones** y
   los **formatos de suministro** de un uso, porque así es como pregunta el cliente: primero «para
   qué», después «qué aleación» y por último «en qué bobina». Campos por grupos: Ficha (nombre,
   slug, familia, destacado), Textos (resumen, descripción, aplicaciones), Datos técnicos
   (aleaciones, formatos, PDF) e Imágenes.
   - **Las aleaciones son filas con columnas de verdad**, no texto libre. Es lo que permite
     alinearlas por columnas y poder filtrarlas mañana. Dejar aquí un campo de texto rico es
     exactamente lo que convierte un catálogo en un PDF.
   - La **familia** es lista cerrada (metallizing, welding, mechanical, casting, electrical): la
     web tiene la traducción preparada para cada valor en los tres idiomas.
   - El orden de la web se cambia **arrastrando** (`orderRank`).
2. **`companyInfo`** (singleton «Empresa y contacto») — titular de portada, descripción, valores,
   cifras, historia, empresas del grupo y todos los datos de contacto, incluidas las coordenadas.
3. **`qualityInfo`** (singleton «Calidad») — introducción, puntos de control en el orden real del
   proceso, laboratorio, certificaciones (con PDF opcional) y medio ambiente.

Calidad va en su **propio** documento y no dentro del de la empresa porque la mantiene calidad, no
marketing: así no hay que abrir el formulario de la empresa entera para tocar un punto de control.

Los textos trilingües usan objetos con `es`/`en`/`fr` al lado (`localizedString`,
`localizedParagraphs`, `localizedList`), no documentos paralelos: se ve de un golpe qué falta
traducir. Con tres columnas el formulario se estrecha, así que **los textos largos van apilados** y
sólo los cortos usan `columns: 3`.

## Lo que NO se puede tocar desde el panel, a propósito

El diseño. Las familias son listas cerradas y las descripciones son **párrafos**, no texto con
formato libre, para que nadie rompa la estética con un titular gigante o una tabla hecha a mano
(las tablas tienen su propio campo, con columnas).

## Publicación

Al pulsar **Publicar**, Sanity llama a `/api/revalidate` con firma, y Next descarta la copia
cacheada del contenido (`CONTENT_TAG`) y la regenera. La web sigue siendo estática y servida desde
el CDN: el cambio se ve en segundos **sin desplegar nada**.

⚠️ **`useCdn: false` en `sanity/client.ts` es deliberado.** La CDN de Sanity puede devolver datos
de hace unos segundos, y al regenerar justo después de publicar volvería a guardar el dato viejo
*como si fuera fresco*, quedándose así indefinidamente.

## Pendiente

- Webhook a `/api/revalidate` en sanity.io/manage › API › Webhooks, con el valor de
  `SANITY_REVALIDATE_SECRET` (está en `.env.local`, que no se sube).
- Invitar a quien vaya a editar en sanity.io/manage › Members.

Relacionado: [[arquitectura-web]], [[trampas-migracion-sanity]], [[pendientes-manfisa]].
