import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { Figures } from '@/components/sections/Figures'
import { NumberedList, Prose, SectionHeading } from '@/components/sections/Prose'
import { site } from '@/content/site'
import { getCompany } from '@/lib/content'
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
    title: t.company.title,
    description: t.company.lead,
    alternates: { canonical: href(locale, 'company') },
  }
}

export default async function CompanyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const company = await getCompany()

  return (
    <>
      <PageHeader title={t.company.title} lead={t.company.lead} />

      <section className="page-gutter">
        <Prose paragraphs={company.statement[locale]} />
      </section>

      <div className="mt-(--spacing-section)">
        <Figures company={company} locale={locale} dictionary={t} />
      </div>

      {company.milestones && company.milestones.length > 0 && (
        <section className="page-gutter pt-(--spacing-section)">
          <SectionHeading>{t.company.history}</SectionHeading>
          {/* Cronología como lista de definiciones: el año define, el texto describe. Es
              lo que le da a un lector de pantalla el par «1973 → se funda la empresa» en
              vez de dos frases sueltas. */}
          <dl className="mt-10 divide-y divide-line border-t border-line">
            {company.milestones.map((milestone) => (
              <div key={milestone.year} className="grid gap-2 py-6 md:grid-cols-12 md:gap-8">
                <dt className="font-mono text-lead tabular-nums md:col-span-3">{milestone.year}</dt>
                <dd className="md:col-span-9">{milestone.text[locale]}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="page-gutter pt-(--spacing-section)">
        <SectionHeading>{t.company.values}</SectionHeading>
        <NumberedList items={company.values[locale]} />
      </section>

      {company.group && company.group.length > 0 && (
        <section className="page-gutter pt-(--spacing-section)">
          <SectionHeading>{t.company.group}</SectionHeading>
          <p className="mt-8 max-w-prose text-graphite-soft">
            {site.parentName} — {site.legalName}
          </p>
          <ul className="mt-8 divide-y divide-line border-t border-line">
            {company.group.map((member) => (
              <li
                key={member.name}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5"
              >
                <span className="font-semibold">{member.name}</span>
                <span className="text-graphite-soft">{member.activity[locale]}</span>
                {member.url && (
                  <a
                    href={member.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline tap text-small text-accent"
                  >
                    {new URL(member.url).hostname.replace(/^www\./, '')}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
