import { cacheLife } from 'next/cache'
import Link from 'next/link'
import { site } from '@/content/site'
import { getCompany } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href, navigation } from '@/lib/i18n/routes'
import { Wordmark } from './Wordmark'

/**
 * El año del copyright, en una función cacheada por días.
 *
 * Con Cache Components, leer la hora actual en un componente de servidor está prohibido
 * (rompería el prerenderizado: ¿de qué momento sería el HTML?). Encerrarlo aquí lo
 * resuelve sin congelarlo para siempre: la caché caduca a diario, así que el 1 de enero el
 * pie se actualiza solo.
 */
async function currentYear(): Promise<number> {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}

export async function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  // Dirección, teléfono y email salen del panel: Manfisa los cambia sin desarrollo.
  const [company, year] = await Promise.all([getCompany(), currentYear()])

  return (
    <footer className="mt-(--spacing-section) bg-inverse text-metal">
      <div className="page-gutter py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <Wordmark className="text-base" />
            <p className="mt-6 max-w-sm text-small text-metal/60">{site.legalName}</p>
            {/* La dirección va en <address> con microdatos ligeros: es el dato que copia
                un transportista y el que lee Google para la ficha de empresa. */}
            <address className="mt-1 max-w-sm text-small text-metal/60 not-italic">
              {company.street} · {company.postalCode} {company.city}
              <br />
              {company.region[locale]}, {company.country[locale]}
            </address>
          </div>

          <div>
            <h2 className="eyebrow text-metal/40">{t.contact.title}</h2>
            <ul className="mt-4 space-y-2 text-small">
              <li>
                <a
                  className="link-underline tap text-metal/70 hover:text-metal"
                  href={`tel:${company.phone.replaceAll(' ', '')}`}
                >
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  className="link-underline tap text-metal/70 hover:text-metal"
                  href={`mailto:${company.email}`}
                >
                  {company.email}
                </a>
              </li>
              {company.linkedin && (
                <li>
                  <a
                    className="link-underline tap text-metal/70 hover:text-metal"
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

          <div>
            <h2 className="eyebrow text-metal/40">{t.nav.home}</h2>
            <ul className="mt-4 space-y-2 text-small">
              {navigation.map((key) => (
                <li key={key}>
                  <Link
                    className="link-underline tap text-metal/70 hover:text-metal"
                    href={href(locale, key)}
                  >
                    {t.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-16 border-t border-metal/15 pt-8 text-micro text-metal/40 md:mt-20">
          © {year} {site.legalName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
