import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { Prose, SectionHeading } from '@/components/sections/Prose'
import { getQuality } from '@/lib/content'
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
    title: t.quality.title,
    description: t.quality.lead,
    alternates: { canonical: href(locale, 'quality') },
  }
}

export default async function QualityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const quality = await getQuality()
  // Sin documento de calidad publicado la página no existe, en vez de existir vacía. Ver
  // el criterio en lib/content.ts: aquí un 404 es más honesto que una página en blanco.
  if (!quality) notFound()

  return (
    <>
      <PageHeader title={t.quality.title} lead={t.quality.lead} />

      <section className="page-gutter">
        <Prose paragraphs={quality.intro[locale]} />
      </section>

      {/* Los puntos de control se pintan como una secuencia numerada, en el orden real del
          proceso: de la materia prima al embalaje. El número es información, no adorno —
          es lo que permite a un auditor referirse a «el paso 4». */}
      <section className="page-gutter pt-(--spacing-section)">
        <SectionHeading>{t.quality.process}</SectionHeading>
        <ol className="mt-10 divide-y divide-line border-t border-line">
          {quality.controls.map((control, index) => (
            <li key={control.stage[locale]} className="grid gap-2 py-6 md:grid-cols-12 md:gap-8">
              <span className="eyebrow tabular-nums md:col-span-1">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-semibold md:col-span-4">{control.stage[locale]}</h3>
              <p className="text-graphite-soft md:col-span-7">{control.text[locale]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="page-gutter pt-(--spacing-section)">
        <SectionHeading>{t.quality.lab}</SectionHeading>
        <Prose paragraphs={quality.lab[locale]} className="mt-8" />
      </section>

      {quality.certifications && quality.certifications.length > 0 && (
        <section className="page-gutter pt-(--spacing-section)">
          <SectionHeading>{t.quality.certifications}</SectionHeading>
          <ul className="mt-10 divide-y divide-line border-t border-line">
            {quality.certifications.map((certification) => (
              <li
                key={certification.name}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-6"
              >
                <div>
                  <h3 className="font-mono">{certification.name}</h3>
                  <p className="mt-1 text-graphite-soft">{certification.scope[locale]}</p>
                  {certification.body && <p className="eyebrow mt-2">{certification.body}</p>}
                </div>
                {certification.url && (
                  <a
                    href={certification.url}
                    download
                    className="link-underline tap shrink-0 text-small text-accent"
                  >
                    PDF
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="page-gutter pt-(--spacing-section)">
        <SectionHeading>{t.quality.environment}</SectionHeading>
        <Prose paragraphs={quality.environment[locale]} className="mt-8" />
      </section>
    </>
  )
}
