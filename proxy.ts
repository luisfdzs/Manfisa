import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, isLocale, locales } from '@/lib/i18n/config'

/**
 * Única responsabilidad: si la URL no trae idioma, deducirlo del navegador y redirigir.
 * Todo lo demás del sitio es estático.
 *
 * En Next 16 el fichero `middleware.ts` se llama `proxy.ts`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocale) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/${negotiateLocale(request)}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

/**
 * Idioma preferido del navegador, de entre los que tenemos.
 *
 * Se compara sólo la parte primaria de la etiqueta (`fr-CA` → `fr`): un cliente en Quebec
 * debe caer en francés, no en español por no coincidir la región.
 */
function negotiateLocale(request: NextRequest): string {
  const header = request.headers.get('accept-language')
  if (!header) return defaultLocale

  const preferred = header
    .split(',')
    .map((part) => {
      const [tag = '', q = 'q=1'] = part.trim().split(';')
      return { tag: tag.toLowerCase().split('-')[0] ?? '', quality: Number(q.replace('q=', '')) }
    })
    .sort((a, b) => b.quality - a.quality)

  return preferred.find(({ tag }) => isLocale(tag))?.tag ?? defaultLocale
}

export const config = {
  // `admin` queda fuera: el panel no tiene versión por idioma y redirigirlo a /es/admin lo
  // dejaría inaccesible.
  matcher: ['/((?!api|admin|_next|favicon|robots.txt|sitemap.xml|.*\\.[\\w]+$).*)'],
}
