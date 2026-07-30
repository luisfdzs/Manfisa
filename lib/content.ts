import { cacheLife, cacheTag } from 'next/cache'
import { z } from 'zod'
import { client } from '@/sanity/client'
import {
  COMPANY_QUERY,
  PRODUCT_LINES_QUERY,
  PRODUCT_LINE_SLUGS_QUERY,
  QUALITY_QUERY,
} from '@/sanity/queries'
import { locales, type Locale, type Localized } from '@/lib/i18n/config'

/**
 * ÚNICA PUERTA DE ACCESO AL CONTENIDO
 *
 * Ninguna página consulta Sanity directamente: todas pasan por aquí. Si mañana el
 * catálogo viniera de un ERP en vez de un CMS, se cambia este módulo y **ninguna vista
 * cambia**. Es exactamente para eso.
 *
 * Criterio de fallos, que es distinto según lo que falte:
 *
 * - Una **línea de producto** incompleta se descarta con un aviso por consola. El
 *   catálogo lo edita una persona desde el navegador y una línea a medio traducir no
 *   puede tumbar la web entera.
 * - **Empresa y contacto** incompleto sí lanza error: el teléfono y el email están en el
 *   pie de TODAS las páginas, así que publicar la web sin ellos es peor que no publicarla.
 */

/** Etiqueta de caché: el webhook de Sanity la invalida al publicar. */
export const CONTENT_TAG = 'sanity-content'

/**
 * «Lo mismo, en los tres idiomas»: construye el esquema a partir de `locales` en vez de
 * escribir `{ es, en, fr }` a mano. Así, el día que se añada un cuarto idioma, TODOS estos
 * esquemas empiezan a exigirlo solos y no hay que acordarse de tocar ninguno.
 *
 * El tipo de retorno se **declara** en vez de dejar que zod lo infiera. No es pereza: de
 * `Object.fromEntries` TypeScript sólo puede deducir claves `string`, así que el tipo
 * inferido sería `Record<string, T>` y cada `texto[locale]` de las vistas pasaría a ser
 * `T | undefined` — trece errores repartidos por las plantillas para expresar una duda que
 * no existe. `locales` es la fuente de las claves: el objeto tiene exactamente una entrada
 * por idioma, siempre.
 */
function localizedOf<T>(value: z.ZodType<T>): z.ZodType<Localized<T>> {
  const shape: Record<string, z.ZodType<T>> = Object.fromEntries(
    locales.map((locale: Locale) => [locale, value]),
  )
  return z.object(shape) as unknown as z.ZodType<Localized<T>>
}

const localizedString = localizedOf(z.string().min(1))
const localizedList = localizedOf(z.array(z.string().min(1)).min(1))

/** Igual que la lista, pero semánticamente son párrafos de prosa, no viñetas. */
const localizedParagraphs = localizedList

const imageSchema = z.object({
  id: z.string(),
  src: z.string().url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  blur: z.string().startsWith('data:image/'),
  alt: localizedString,
})

const documentSchema = z.object({
  label: localizedString,
  url: z.string().url(),
  size: z.number().int().positive().nullish(),
})

const alloySchema = z.object({
  designation: z.string().min(1),
  purity: z.string().min(1),
  tensile: z.string().nullish(),
  elongation: z.string().nullish(),
  diameters: z.string().min(1),
  note: localizedString.nullish(),
})

const supplySchema = z.object({
  format: localizedString,
  weight: z.string().min(1),
  packaging: localizedString,
})

export const families = ['metallizing', 'welding', 'mechanical', 'casting', 'electrical'] as const
export type Family = (typeof families)[number]

const productLineSchema = z.object({
  slug: z.string().min(1),
  title: localizedString,
  family: z.enum(families),
  featured: z.boolean().nullish(),
  summary: localizedString,
  body: localizedParagraphs,
  applications: localizedList,
  alloys: z.array(alloySchema).nullish(),
  supply: z.array(supplySchema).nullish(),
  documents: z.array(documentSchema).nullish(),
  images: z.array(imageSchema).min(1),
})

const figureSchema = z.object({ value: z.string().min(1), label: localizedString })

const companySchema = z.object({
  claim: localizedString,
  // Mínimo tres: con menos, el mosaico de la portada no tiene piezas que combinar y queda
  // como una foto suelta mal recortada. El panel exige lo mismo.
  heroMontage: z.array(imageSchema).min(3),
  statement: localizedParagraphs,
  values: localizedList,
  figures: z.array(figureSchema).min(2),
  milestones: z.array(z.object({ year: z.string().min(1), text: localizedString })).nullish(),
  group: z
    .array(
      z.object({
        name: z.string().min(1),
        activity: localizedString,
        url: z.string().url().nullish(),
      }),
    )
    .nullish(),
  street: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  region: localizedString,
  country: localizedString,
  phone: z.string().min(1),
  fax: z.string().nullish(),
  email: z.string().email(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).nullish(),
  linkedin: z.string().url().nullish(),
})

const qualitySchema = z.object({
  intro: localizedParagraphs,
  controls: z.array(z.object({ stage: localizedString, text: localizedString })).min(1),
  lab: localizedParagraphs,
  certifications: z
    .array(
      z.object({
        name: z.string().min(1),
        scope: localizedString,
        body: z.string().nullish(),
        url: z.string().url().nullish(),
      }),
    )
    .nullish(),
  environment: localizedParagraphs,
})

export type DescribedImage = z.infer<typeof imageSchema>
export type TechnicalDocument = z.infer<typeof documentSchema>
export type Alloy = z.infer<typeof alloySchema>
export type SupplyFormat = z.infer<typeof supplySchema>
export type ProductLine = z.infer<typeof productLineSchema> & {
  alloys: Alloy[]
  supply: SupplyFormat[]
  documents: TechnicalDocument[]
  cover: DescribedImage
}
export type Company = z.infer<typeof companySchema>
export type Quality = z.infer<typeof qualitySchema>

/**
 * Lee de Sanity y **cachea con etiqueta**: la web se sirve estática hasta que alguien
 * publica, y entonces el webhook invalida esta etiqueta y se regenera.
 *
 * Ojo con un fallo silencioso fácil de cometer aquí: pasar `{ next: { tags } }` como
 * tercer argumento de `client.fetch` **no hace nada** — `@sanity/client` no usa el
 * `fetch` de Next con sus extensiones. Los datos quedarían horneados en el build sin
 * etiqueta, el webhook respondería 200 y la web no se actualizaría nunca. La forma
 * correcta en Next 16 es la directiva `use cache` con `cacheTag`, que sí registra la
 * dependencia.
 */
async function fetchContent<T>(query: string): Promise<T> {
  'use cache'
  cacheTag(CONTENT_TAG)
  // 'max': se sirve de caché indefinidamente y sólo cambia cuando se publica algo.
  cacheLife('max')
  return client.fetch<T>(query)
}

/**
 * Valida cada documento por separado y descarta los que no cumplen, en vez de fallar en
 * bloque. Así una línea sin imágenes o sin traducir al francés no deja el catálogo entero
 * fuera de servicio.
 */
function keepValid<T>(items: unknown[], schema: z.ZodType<T>, label: string): T[] {
  const valid: T[] = []
  for (const item of items) {
    const result = schema.safeParse(item)
    if (result.success) {
      valid.push(result.data)
    } else {
      const name =
        (item as { title?: { es?: string } })?.title?.es ??
        (item as { slug?: string })?.slug ??
        '(sin título)'
      console.warn(
        `[contenido] Se omite ${label} «${name}»: ${result.error.issues
          .map((issue) => `${issue.path.join('.')} ${issue.message}`)
          .join('; ')}`,
      )
    }
  }
  return valid
}

export async function getProductLines(): Promise<ProductLine[]> {
  const raw = await fetchContent<unknown[]>(PRODUCT_LINES_QUERY)
  return keepValid(raw, productLineSchema, 'la línea').map((line) => ({
    ...line,
    alloys: line.alloys ?? [],
    supply: line.supply ?? [],
    documents: line.documents ?? [],
    // La portada es siempre la primera de la galería; el esquema garantiza que existe.
    cover: line.images[0]!,
  }))
}

export async function getFeaturedProductLines(limit = 6): Promise<ProductLine[]> {
  const lines = await getProductLines()
  const featured = lines.filter((line) => line.featured)
  return (featured.length > 0 ? featured : lines).slice(0, limit)
}

export async function getProductLine(slug: string): Promise<ProductLine | undefined> {
  const lines = await getProductLines()
  return lines.find((line) => line.slug === slug)
}

export async function getProductLineSlugs(): Promise<string[]> {
  const raw = await fetchContent<{ slug: string | null }[]>(PRODUCT_LINE_SLUGS_QUERY)
  return raw.map((row) => row.slug).filter((slug): slug is string => Boolean(slug))
}

/** Línea anterior y siguiente, en bucle, para recorrer el catálogo sin volver al índice. */
export async function getProductLineNeighbours(
  slug: string,
): Promise<{ previous: ProductLine; next: ProductLine } | null> {
  const lines = await getProductLines()
  const index = lines.findIndex((line) => line.slug === slug)
  if (index === -1 || lines.length < 2) return null
  const previous = lines[(index - 1 + lines.length) % lines.length]
  const next = lines[(index + 1) % lines.length]
  if (!previous || !next) return null
  return { previous, next }
}

/**
 * Datos de la empresa. Si faltan o están incompletos es un fallo grave (afectan al pie de
 * todas las páginas), así que aquí sí se lanza error con un mensaje que dice qué rellenar.
 */
export async function getCompany(): Promise<Company> {
  const raw = await fetchContent<unknown>(COMPANY_QUERY)
  const result = companySchema.safeParse(raw)
  if (!result.success) {
    throw new Error(
      `[contenido] El documento «Empresa y contacto» del panel está incompleto: ` +
        result.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; '),
    )
  }
  return result.data
}

/**
 * Contenido de la página de Calidad. A diferencia de la empresa, si falta **no** se
 * revienta el sitio: se devuelve `null` y la página responde 404. Calidad es una página
 * más; el pie no depende de ella.
 */
export async function getQuality(): Promise<Quality | null> {
  const raw = await fetchContent<unknown>(QUALITY_QUERY)
  const result = qualitySchema.safeParse(raw)
  if (!result.success) {
    console.warn(
      `[contenido] El documento «Calidad» está incompleto, la página no se publica: ` +
        result.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; '),
    )
    return null
  }
  return result.data
}

export type { Localized }
