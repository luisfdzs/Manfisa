import { defineQuery } from 'next-sanity'

/**
 * CONSULTAS (GROQ)
 *
 * Todas piden ya resuelto lo que la web necesita para pintar una imagen sin pensar: URL
 * del original, dimensiones reales y `lqip` (la miniatura difuminada que Sanity calcula
 * al subir el archivo). Con eso: cero salto de layout y placeholder suave, para imágenes
 * que sube cualquiera desde el navegador.
 */

const IMAGE = /* groq */ `{
  "id": asset.asset->_id,
  "src": asset.asset->url,
  "width": asset.asset->metadata.dimensions.width,
  "height": asset.asset->metadata.dimensions.height,
  "blur": asset.asset->metadata.lqip,
  alt
}`

/** Los PDF se resuelven a URL directa: la web los ofrece como descarga, no los procesa. */
const DOCUMENT = /* groq */ `{
  label,
  "url": file.asset->url,
  "size": file.asset->size
}`

const LINE_FIELDS = /* groq */ `
  "slug": slug.current,
  title,
  family,
  featured,
  summary,
  body,
  applications,
  "alloys": alloys[] { designation, purity, tensile, elongation, diameters, note },
  "supply": supply[] { format, weight, packaging },
  "documents": documents[] ${DOCUMENT},
  "images": images[] ${IMAGE}
`

/** El orden es el que se fija arrastrando en el panel (orderRank). */
export const PRODUCT_LINES_QUERY = defineQuery(`
  *[_type == "productLine" && defined(slug.current)] | order(orderRank) {
    ${LINE_FIELDS}
  }
`)

export const PRODUCT_LINE_SLUGS_QUERY = defineQuery(`
  *[_type == "productLine" && defined(slug.current)] | order(orderRank) { "slug": slug.current }
`)

export const COMPANY_QUERY = defineQuery(`
  *[_type == "companyInfo"][0] {
    claim,
    statement,
    values,
    "figures": figures[] { value, label },
    "milestones": milestones[] { year, text },
    "group": group[] { name, activity, url },
    street,
    postalCode,
    city,
    region,
    country,
    phone,
    fax,
    email,
    "coordinates": coordinates { lat, lng },
    linkedin
  }
`)

export const QUALITY_QUERY = defineQuery(`
  *[_type == "qualityInfo"][0] {
    intro,
    "controls": controls[] { stage, text },
    lab,
    "certifications": certifications[] {
      name,
      scope,
      body,
      "url": file.asset->url
    },
    environment
  }
`)
