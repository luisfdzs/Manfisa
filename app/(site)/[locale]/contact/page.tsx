import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionHeading } from '@/components/sections/Prose'
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
    title: t.contact.title,
    description: t.contact.lead,
    alternates: { canonical: href(locale, 'contact') },
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const company = await getCompany()

  /**
   * Datos estructurados de la planta para Google (schema.org).
   *
   * Es lo que alimenta la ficha de empresa en el buscador y en Maps: sin esto, la dirección
   * es un párrafo cualquiera. Se genera del mismo documento del panel que el texto visible,
   * así que **no pueden divergir** — que es exactamente lo que pasa cuando el JSON-LD se
   * escribe a mano en una plantilla y seis meses después cambia el teléfono.
   */
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    legalName: site.legalName,
    parentOrganization: site.parentName,
    url: site.url,
    email: company.email,
    telephone: company.phone,
    faxNumber: company.fax ?? undefined,
    sameAs: company.linkedin ? [company.linkedin] : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.street,
      postalCode: company.postalCode,
      addressLocality: company.city,
      addressRegion: company.region.es,
      addressCountry: 'ES',
    },
    geo: company.coordinates
      ? {
          '@type': 'GeoCoordinates',
          latitude: company.coordinates.lat,
          longitude: company.coordinates.lng,
        }
      : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        // El objeto lo construimos nosotros a partir de datos validados con zod: no hay
        // entrada de usuario que pueda cerrar la etiqueta <script>.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PageHeader title={t.contact.title} lead={t.contact.lead} />

      <section className="page-gutter">
        <div className="grid gap-12 border-t border-line pt-12 md:grid-cols-3 md:gap-8">
          <div>
            <h2 className="eyebrow">{t.contact.address}</h2>
            <address className="mt-4 not-italic">
              {site.legalName}
              <br />
              {company.street}
              <br />
              {company.postalCode} {company.city}
              <br />
              {company.region[locale]}, {company.country[locale]}
            </address>
            {company.coordinates && (
              // Enlace a un mapa externo en vez de un iframe incrustado: un mapa embebido
              // mete cookies de terceros en TODAS las visitas (y por tanto un banner de
              // consentimiento) a cambio de una imagen que casi nadie usa. Quien quiere
              // llegar, pulsa.
              <a
                href={`https://www.openstreetmap.org/?mlat=${company.coordinates.lat}&mlon=${company.coordinates.lng}#map=16/${company.coordinates.lat}/${company.coordinates.lng}`}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline tap mt-4 inline-block text-small text-accent"
              >
                {t.contact.openMap}
              </a>
            )}
          </div>

          <div>
            <h2 className="eyebrow">{t.contact.phone}</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a className="link-underline tap" href={`tel:${company.phone.replaceAll(' ', '')}`}>
                  {company.phone}
                </a>
              </li>
              {company.fax && (
                <li className="text-graphite-soft">
                  {t.contact.fax} {company.fax}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow">{t.contact.email}</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a className="link-underline tap text-accent" href={`mailto:${company.email}`}>
                  {company.email}
                </a>
              </li>
              {company.linkedin && (
                <li>
                  <a
                    className="link-underline tap"
                    href={company.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="page-gutter pt-(--spacing-section)">
        <SectionHeading>{t.contact.directions}</SectionHeading>
        <p className="mt-8 max-w-prose text-graphite-soft">
          {locale === 'es' &&
            'La planta está en el polígono de Irurtzun, junto a la A-15 (salida 116), a 20 minutos de Pamplona y a hora y media del puerto de Bilbao.'}
          {locale === 'en' &&
            'The plant is in the Irurtzun industrial estate, just off the A-15 motorway (exit 116), 20 minutes from Pamplona and 90 minutes from the port of Bilbao.'}
          {locale === 'fr' &&
            'L’usine se trouve dans la zone industrielle d’Irurtzun, en bordure de l’autoroute A-15 (sortie 116), à 20 minutes de Pampelune et à une heure et demie du port de Bilbao.'}
        </p>
      </section>
    </>
  )
}
