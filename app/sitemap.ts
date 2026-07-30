import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { getProductLineSlugs } from '@/lib/content'
import { locales } from '@/lib/i18n/config'
import { href, navigation } from '@/lib/i18n/routes'

/**
 * Sitemap generado del contenido real: no hay lista de URLs que mantener a mano y por tanto
 * no puede quedar desactualizado.
 *
 * Cada URL declara sus `alternates` en los tres idiomas. Sin eso, Google trata /es, /en y
 * /fr como tres páginas que compiten entre sí en vez de como la misma página en tres
 * idiomas — que en una web trilingüe es el error de posicionamiento más caro y el más
 * silencioso.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const slugs = await getProductLineSlugs()

  const alternates = (build: (locale: (typeof locales)[number]) => string) => ({
    languages: Object.fromEntries(locales.map((locale) => [locale, `${site.url}${build(locale)}`])),
  })

  for (const locale of locales) {
    entries.push({
      url: `${site.url}/${locale}`,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: alternates((l) => href(l, 'home')),
    })

    for (const key of navigation) {
      entries.push({
        url: `${site.url}${href(locale, key)}`,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: alternates((l) => href(l, key)),
      })
    }

    for (const slug of slugs) {
      entries.push({
        url: `${site.url}${href(locale, 'products', slug)}`,
        changeFrequency: 'yearly',
        priority: 0.7,
        alternates: alternates((l) => href(l, 'products', slug)),
      })
    }
  }

  return entries
}
