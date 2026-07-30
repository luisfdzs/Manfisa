---
name: trampas-migracion-sanity
description: Tres fallos silenciosos de sanity dataset import que costaron tiempo — el punto en el _id, el file:// del _sanityAsset y el _type de los objetos
metadata:
  type: project
---

Tres trampas del importador de Sanity, todas encontradas montando este proyecto. Las tres son
silenciosas o dan un error que no dice lo que pasa, así que van escritas.

## 1. Un punto en el `_id` hace desaparecer el documento

Los `_id` se derivan del slug para que la importación sea idempotente. Se empezó con
`productLine.metallizing-wire` — **con punto**. El importador dijo `Imported 7 documents`, sin
errores, y los cinco documentos de catálogo **no aparecían en ninguna consulta**.

**Motivo:** el punto en un `_id` de Sanity marca un **espacio de nombres reservado** (`drafts.…`,
`versions.…`). El documento se crea, pero queda fuera de las consultas normales.

**Cómo se manifestó:** no al importar, sino mucho después, en `npm run build`, con
`EmptyGenerateStaticParamsError` — porque Cache Components exige que `generateStaticParams` devuelva
al menos un resultado. El síntoma («build falla») estaba a tres pasos de la causa («el `_id` lleva
un punto»).

**Regla: el separador del `_id` es un GUION.** `productLine-metallizing-wire`.

## 2. `_sanityAsset` necesita esquema de URL, no una ruta relativa

Se escribió `image@./placeholders/x.jpg` y falló con:

> Asset type is not specified. `_sanityAsset` values must be prefixed with a type, eg image@url

El mensaje culpa al **prefijo de tipo**, que estaba puesto. El problema real es que el validador
(`node_modules/@sanity/import/dist/assetRefs.js`) usa la expresión
`/^(file|image)@([a-z]+:\/\/.*)/`: exige **un esquema de URL** además del prefijo.

**Forma correcta: `image@file://./placeholders/x.jpg`.** El `./` es lo que hace que el importador
resuelva la ruta contra la carpeta **del NDJSON** (lo hace `absolutifyPaths`), no contra el
directorio desde el que se lanza npm.

## 3. Los objetos importados necesitan su `_type`

Sanity puede inferir el tipo del esquema al **leer**, pero el **panel** lo necesita para saber qué
formulario dibujar: sin `_type`, un campo importado se abre como objeto desconocido. Hay que
etiquetar todos: `localizedString`, `localizedParagraphs`, `localizedList`, `alloy`,
`supplyFormat`, `plantImage`, `figure`, `milestone`, `groupCompany`, `control`, `certification`,
`slug`, `geopoint`. Y los elementos de array necesitan además **`_key`** para poder reordenarse.

En `scripts/build-sanity-import.mjs` esto se resuelve con tres atajos (`str`, `par`, `list`) y un
helper `keyed`, en vez de repetir la etiqueta cincuenta veces.

## Bonus: el argumento posicional de dataset está deprecado

`sanity dataset import fichero.ndjson production --replace` avisa. La forma actual es
`--dataset production`.

Relacionado: [[panel-administracion]], [[arquitectura-web]].
