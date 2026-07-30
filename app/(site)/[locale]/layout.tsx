import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { site } from '@/content/site'
import { isLocale, localeHtmlLang, locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isIndexable } from '@/lib/site-env'
import '../../globals.css'

/**
 * Fuentes autoalojadas por Next: se sirven desde nuestro dominio, con `swap` y sin
 * petición a Google. Es la diferencia entre texto que aparece al instante y texto que salta
 * cuando la fuente llega.
 *
 * La mono no es decorativa: sostiene las tablas de aleaciones, donde las cifras tienen que
 * alinearse por columnas. Se cargan sólo dos pesos de cada una — cada peso extra es otra
 * descarga que retrasa el primer texto.
 */
const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-plex-sans',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-plex-mono',
})

export const viewport: Viewport = {
  themeColor: '#f5f7f8',
}

/** Las tres versiones de idioma se generan en build; no hay renderizado dinámico. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/**
 * Sólo existen /es, /en y /fr: cualquier otro valor de `[locale]` es un 404. No se declara
 * con `export const dynamicParams = false` porque **Cache Components no lo admite** (ver
 * `cacheComponents` en next.config.ts). El `notFound()` del layout cumple la misma función:
 * un idioma desconocido devuelve 404 en lugar de intentar renderizarse.
 */

/** Descripciones por idioma. Están aquí y no en el panel a propósito: son metadatos de
 *  posicionamiento, y dejarlos editables invita a rellenarlos de palabras clave. */
const meta: Record<Locale, { title: string; description: string }> = {
  es: {
    title: 'Hilo de aluminio trefilado para metalización, soldadura y fundición',
    description:
      'Manfisa fabrica hilo de aluminio de alta pureza en Irurtzun (Navarra) desde 1973. Aleaciones para metalización de film y papel, soldadura, remaches y fundición.',
  },
  en: {
    title: 'Drawn aluminium wire for metallizing, welding and casting',
    description:
      'Manfisa has been drawing high purity aluminium wire in Irurtzun (Navarre, Spain) since 1973. Alloys for film and paper metallizing, welding, rivets and casting.',
  },
  fr: {
    title: 'Fil d’aluminium tréfilé pour métallisation, soudage et fonderie',
    description:
      'Manfisa produit du fil d’aluminium de haute pureté à Irurtzun (Navarre, Espagne) depuis 1973. Alliages pour la métallisation de film et papier, le soudage, les rivets et la fonderie.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const { title, description } = meta[locale]
  const fullTitle = `${site.name} · ${title}`

  return {
    metadataBase: new URL(site.url),
    title: { default: fullTitle, template: `%s · ${site.name}` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [localeHtmlLang[l], `/${l}`])),
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: localeHtmlLang[locale],
      title: fullTitle,
      description,
      url: `/${locale}`,
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
    // Sólo la rama main se indexa; test y previews van con noindex. El criterio y el
    // motivo (test es "production" en su propio proyecto) en lib/site-env.ts.
    robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const typedLocale: Locale = locale
  const dictionary = getDictionary(typedLocale)

  return (
    <html
      lang={localeHtmlLang[typedLocale]}
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${mono.variable}`}
    >
      <body className="flex min-h-svh flex-col">
        <Header locale={typedLocale} dictionary={dictionary} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={typedLocale} />
      </body>
    </html>
  )
}
