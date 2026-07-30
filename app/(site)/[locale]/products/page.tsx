import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { LineCard } from '@/components/sections/LineCard'
import { Reveal } from '@/components/ui/Reveal'
import { families, getProductLines, type Family } from '@/lib/content'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return {
    title: t.products.title,
    description: t.products.lead,
    alternates: { canonical: href(locale, 'products') },
  }
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const lines = await getProductLines()

  /**
   * Agrupado por familia, no una lista plana.
   *
   * En este catálogo el cliente no busca «una línea», busca «algo para metalizar»: la
   * familia es su primer filtro mental. Se agrupa recorriendo `families` en su orden
   * declarado —no las claves que aparezcan en el contenido— para que el orden de la página
   * no dependa de en qué orden se creó cada documento en el panel.
   */
  const grouped = families
    .map((family) => ({ family, lines: lines.filter((line) => line.family === family) }))
    .filter((group): group is { family: Family; lines: typeof lines } => group.lines.length > 0)

  return (
    <>
      <PageHeader title={t.products.title} lead={t.products.lead} />

      {grouped.length === 0 ? (
        <p className="page-gutter pb-(--spacing-section) text-graphite-soft">{t.products.empty}</p>
      ) : (
        grouped.map((group) => (
          <section key={group.family} className="page-gutter pb-(--spacing-section)">
            <h2 className="eyebrow border-b border-line pb-4">{t.family[group.family]}</h2>
            <div className="mt-10 grid gap-x-8 gap-y-16 md:grid-cols-2">
              {group.lines.map((line, index) => (
                <Reveal key={line.slug} step={index % 2}>
                  <LineCard line={line} locale={locale} dictionary={t} />
                </Reveal>
              ))}
            </div>
          </section>
        ))
      )}
    </>
  )
}
