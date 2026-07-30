import Link from 'next/link'
import { defaultLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

/**
 * 404 dentro del segmento de idioma.
 *
 * Usa el idioma por defecto y no el de la URL a propósito: cuando `notFound()` salta porque
 * el locale **no es válido** (`/de/products`), no hay idioma del que tirar. Traducirlo al
 * español es honesto; inventarse un alemán a partir de un segmento inválido, no.
 */
export default function NotFound() {
  const t = getDictionary(defaultLocale)

  return (
    <div className="page-gutter flex min-h-[70svh] flex-col justify-center py-32">
      <p className="eyebrow">404</p>
      <h1 className="text-title mt-4 max-w-2xl font-semibold text-balance">{t.notFound.title}</h1>
      <p className="mt-4 max-w-prose text-graphite-soft">{t.notFound.lead}</p>
      <Link
        href={href(defaultLocale, 'home')}
        className="link-underline tap mt-8 self-start text-small text-accent"
      >
        {t.notFound.cta}
      </Link>
    </div>
  )
}
