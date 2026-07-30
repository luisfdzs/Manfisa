#!/usr/bin/env node
/**
 * CONSTRUCTOR DEL FICHERO DE IMPORTACIÓN · `npm run migrate:build`
 *
 * Convierte `scripts/migration/content-snapshot.mjs` en el NDJSON que traga
 * `sanity dataset import`. Un documento por línea, sin comas ni corchetes: es el formato que
 * espera el CLI.
 *
 * Dos cosas que hacen que la importación sea **idempotente**, y que son la diferencia entre
 * poder repetirla y duplicar el catálogo entero:
 *
 * 1. **Los `_id` se derivan del slug** (`productLine-metallizing-wire`), no se generan al
 *    azar. Volver a importar actualiza el documento que ya existe.
 * 2. **Los singletons usan un `_id` fijo** (`companyInfo`, `qualityInfo`), el mismo que abre
 *    `sanity/structure.ts`. Si no coincidieran, el panel abriría un documento vacío y el
 *    contenido importado quedaría invisible en otro.
 *
 * ⚠️ **El separador del `_id` es un GUION, nunca un punto.** El punto en un `_id` de Sanity
 * marca un espacio de nombres reservado (`drafts.…`, `versions.…`), así que
 * `productLine.metallizing-wire` se importa sin errores —el CLI dice «Imported 7 documents»—
 * y luego **no aparece en ninguna consulta**. Pasó: la importación se dio por buena y el build
 * falló mucho después, en `generateStaticParams`, con un dataset aparentemente vacío de
 * productos. Con guion no hay ambigüedad.
 *
 * Las imágenes se referencian con `_sanityAsset`, la forma que tiene el importador de subir
 * un archivo local y dejar la referencia resuelta. El valor tiene que ser
 * `image@file://./ruta`: el importador exige el prefijo de tipo **y un esquema de URL**
 * (`file://`), y es el `./` lo que hace que resuelva la ruta contra la carpeta de este
 * NDJSON y no contra el directorio desde el que se lanza npm. Sin el `file://` falla con
 * «Asset type is not specified», que no dice en absoluto lo que pasa.
 *
 * Cada objeto lleva su `_type` explícito (`localizedString`, `localizedParagraphs`,
 * `alloy`…). Sanity puede inferirlo del esquema al leer, pero el panel lo necesita para saber
 * qué formulario dibujar: sin `_type`, un campo importado se abre como objeto desconocido.
 *
 * El orden de arrastre (`orderRank`) se siembra con cadenas crecientes. Sin sembrarlo, todas
 * las líneas nacen con el mismo rango y el listado del panel las ordena de forma arbitraria
 * hasta que alguien arrastra una.
 */

import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { company, productLines, quality } from './migration/content-snapshot.mjs'
import { GALLERIES, MONTAGE, slugify } from './source-images.mjs'

const OUT = path.join(import.meta.dirname, 'migration', 'import.ndjson')

/**
 * Convierte una entrada del catálogo de imágenes en un `plantImage` listo para importar.
 * Los ficheros los deja `npm run images` en `migration/media/`; si falta alguno, el
 * importador aborta con el nombre concreto, que es justo lo que se quiere saber.
 */
const image = (entry, index) => ({
  _key: `image${index}`,
  _type: 'plantImage',
  asset: { _type: 'image', _sanityAsset: `image@file://./media/${slugify(entry.file)}.webp` },
  alt: { _type: 'localizedString', ...entry.alt },
})

/** Rango lexicográfico creciente, compatible con el que usa @sanity/orderable-document-list. */
const rank = (index) => `0|${String(index).padStart(6, '0')}:`

/** Etiquetadores de tipo. `str` para textos de una línea, `par` para párrafos, `list` para
 *  listas de frases — los tres tipos declarados en `sanity/schemas/localized.ts`. */
const str = (value) => (value ? { _type: 'localizedString', ...value } : undefined)
const par = (value) => ({ _type: 'localizedParagraphs', ...value })
const list = (value) => ({ _type: 'localizedList', ...value })

/** Añade `_key` y `_type` a los elementos de un array (Sanity los exige para poder
 *  reordenarlos y editarlos individualmente en el panel). */
const keyed = (items, type, map) =>
  items.map((item, index) => ({ _key: `${type}${index}`, _type: type, ...map(item) }))

const documents = []

productLines.forEach((line, index) => {
  documents.push({
    _id: `productLine-${line.slug}`,
    _type: 'productLine',
    title: str(line.title),
    slug: { _type: 'slug', current: line.slug },
    family: line.family,
    featured: line.featured ?? false,
    summary: str(line.summary),
    body: par(line.body),
    applications: list(line.applications),
    alloys: keyed(line.alloys, 'alloy', (alloy) => ({
      designation: alloy.designation,
      purity: alloy.purity,
      tensile: alloy.tensile,
      elongation: alloy.elongation,
      diameters: alloy.diameters,
      note: str(alloy.note),
    })),
    supply: keyed(line.supply, 'supplyFormat', (format) => ({
      format: str(format.format),
      weight: format.weight,
      packaging: str(format.packaging),
    })),
    // La galería de cada línea se toma por FAMILIA, no por slug: si mañana se renombra una
    // línea, las fotos la siguen. La primera de la lista es la portada.
    images: (GALLERIES[line.family] ?? []).map(image),
    orderRank: rank(index),
  })
})

documents.push({
  _id: 'companyInfo',
  _type: 'companyInfo',
  claim: str(company.claim),
  heroMontage: MONTAGE.map(image),
  statement: par(company.statement),
  values: list(company.values),
  figures: keyed(company.figures, 'figure', (figure) => ({
    value: figure.value,
    label: str(figure.label),
  })),
  milestones: keyed(company.milestones, 'milestone', (milestone) => ({
    year: milestone.year,
    text: str(milestone.text),
  })),
  group: keyed(company.group, 'groupCompany', (member) => ({
    name: member.name,
    activity: str(member.activity),
    url: member.url,
  })),
  street: company.street,
  postalCode: company.postalCode,
  city: company.city,
  region: str(company.region),
  country: str(company.country),
  phone: company.phone,
  fax: company.fax,
  email: company.email,
  coordinates: { _type: 'geopoint', ...company.coordinates },
})

documents.push({
  _id: 'qualityInfo',
  _type: 'qualityInfo',
  intro: par(quality.intro),
  controls: keyed(quality.controls, 'control', (control) => ({
    stage: str(control.stage),
    text: str(control.text),
  })),
  lab: par(quality.lab),
  certifications: keyed(quality.certifications, 'certification', (certification) => ({
    name: certification.name,
    scope: str(certification.scope),
    body: certification.body,
  })),
  environment: par(quality.environment),
})

await writeFile(OUT, documents.map((document) => JSON.stringify(document)).join('\n') + '\n')

console.log(
  `\n${documents.length} documentos escritos en ${path.relative(process.cwd(), OUT)} ` +
    `(${productLines.length} líneas de producto + empresa + calidad)\n` +
    `Siguiente paso: npm run migrate:import\n`,
)
