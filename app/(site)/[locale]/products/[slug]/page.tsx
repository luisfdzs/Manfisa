import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlloyTable } from '@/components/sections/AlloyTable'
import { DocumentList } from '@/components/sections/DocumentList'
import { NumberedList, Prose, SectionHeading } from '@/components/sections/Prose'
import { SupplyTable } from '@/components/sections/SupplyTable'
import { Media } from '@/components/ui/Media'
import { Reveal } from '@/components/ui/Reveal'
import {
  getCompany,
  getProductLine,
  getProductLineNeighbours,
  getProductLineSlugs,
} from '@/lib/content'
import { isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/** Todas las fichas × todos los idiomas se prerrenderizan en build. */
export async function generateStaticParams() {
  const slugs = await getProductLineSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const line = await getProductLine(slug)
  if (!line) return {}

  return {
    title: line.title[locale],
    description: line.summary[locale],
    alternates: {
      canonical: href(locale, 'products', slug),
      languages: Object.fromEntries(locales.map((l) => [l, href(l, 'products', slug)])),
    },
    openGraph: {
      title: line.title[locale],
      description: line.summary[locale],
      images: [{ url: line.cover.src }],
    },
  }
}

export default async function ProductLinePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const line = await getProductLine(slug)
  if (!line) notFound()

  const [neighbours, company] = await Promise.all([getProductLineNeighbours(slug), getCompany()])
  // La portada abre la ficha; el resto de la galería va al final. Repetirla en medio sería
  // mostrar la misma foto dos veces en la misma página.
  const gallery = line.images.slice(1)

  return (
    <>
      <header className="page-gutter pt-32 pb-12 md:pt-44 md:pb-16">
        <p className="eyebrow">{t.family[line.family]}</p>
        <h1 className="text-display mt-4 max-w-4xl font-semibold text-balance">
          {line.title[locale]}
        </h1>
        <p className="text-lead mt-6 max-w-2xl text-graphite-soft">{line.summary[locale]}</p>
      </header>

      <div className="page-gutter">
        <Media
          image={line.cover}
          alt={line.cover.alt[locale]}
          sizes="(min-width: 1280px) 1200px, 100vw"
          ratio="16 / 9"
          priority
          quality={82}
        />
      </div>

      <section className="page-gutter pt-(--spacing-section)">
        <Prose paragraphs={line.body[locale]} />
      </section>

      <section className="page-gutter pt-(--spacing-section)">
        <SectionHeading>{t.line.applications}</SectionHeading>
        <NumberedList items={line.applications[locale]} />
      </section>

      {line.alloys.length > 0 && (
        <section className="page-gutter pt-(--spacing-section)">
          <SectionHeading>{t.line.alloys}</SectionHeading>
          <div className="mt-8">
            <AlloyTable alloys={line.alloys} locale={locale} dictionary={t} />
          </div>
        </section>
      )}

      {line.supply.length > 0 && (
        <section className="page-gutter pt-(--spacing-section)">
          <SectionHeading>{t.line.supply}</SectionHeading>
          <div className="mt-8">
            <SupplyTable supply={line.supply} locale={locale} dictionary={t} />
          </div>
        </section>
      )}

      {line.documents.length > 0 && (
        <section className="page-gutter pt-(--spacing-section)">
          <SectionHeading>{t.line.downloads}</SectionHeading>
          <DocumentList documents={line.documents} locale={locale} dictionary={t} />
        </section>
      )}

      {/* Asesoramiento técnico: el email va directo, sin formulario. Un formulario aquí
          significaría backend de envío, antispam y política de privacidad, y lo que gana el
          cliente es un campo menos que rellenar en su propio gestor de correo. */}
      <section className="page-gutter pt-(--spacing-section)">
        <div className="border-t border-line pt-12 md:flex md:items-end md:justify-between md:gap-16">
          <div>
            <h2 className="text-title max-w-xl font-semibold text-balance">{t.line.advice}</h2>
            <p className="mt-4 max-w-prose text-graphite-soft">{t.line.adviceLead}</p>
          </div>
          <a
            href={`mailto:${company.email}?subject=${encodeURIComponent(line.title[locale])}`}
            className="link-underline tap mt-8 inline-block shrink-0 text-small text-accent md:mt-0"
          >
            {company.email}
          </a>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="page-gutter pt-(--spacing-section)">
          <SectionHeading>{t.line.gallery}</SectionHeading>
          {/* Tres columnas, no dos. Varias fotos de formato sólo existen a 329 px en el
              material que publica Manfisa (ver `scripts/source-images.mjs`): a media anchura
              saldrían ampliadas y borrosas, y a un tercio caben sin estirarse. Cuando lleguen
              los originales grandes, esto se puede volver a abrir. */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {gallery.map((image, index) => (
              <Reveal key={image.id} step={index % 3}>
                <Media
                  image={image}
                  alt={image.alt[locale]}
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  ratio="4 / 3"
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Recorrido del catálogo sin volver al índice: anterior / siguiente en bucle. */}
      <nav className="page-gutter pt-(--spacing-section)" aria-label={t.products.title}>
        <div className="flex flex-wrap items-baseline justify-between gap-6 border-t border-line pt-8">
          <Link href={href(locale, 'products')} className="link-underline tap text-small">
            {t.line.backToProducts}
          </Link>
          {neighbours && (
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <Link
                href={href(locale, 'products', neighbours.previous.slug)}
                className="link-underline tap text-small text-graphite-soft hover:text-graphite"
              >
                {t.line.previous}
              </Link>
              <Link
                href={href(locale, 'products', neighbours.next.slug)}
                className="link-underline tap text-small text-graphite-soft hover:text-graphite"
              >
                {t.line.next}
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
