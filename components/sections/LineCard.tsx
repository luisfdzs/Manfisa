import Link from 'next/link'
import { Media } from '@/components/ui/Media'
import type { ProductLine } from '@/lib/content'
import { cn } from '@/lib/cn'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

type Props = {
  line: ProductLine
  locale: Locale
  dictionary: Dictionary
  /** Ancha (fila completa) o mitad. Lo decide la rejilla que la contiene. */
  span?: 'wide' | 'half'
}

/**
 * Ficha de una línea de producto en un listado.
 *
 * Además del nombre y el resumen muestra **cuántas aleaciones tiene y en qué diámetros**:
 * es el dato por el que un comprador industrial decide si merece la pena entrar, y
 * dejarlo dentro de la ficha obliga a un clic para descubrir que no era lo que buscaba.
 */
export function LineCard({ line, locale, dictionary, span = 'half' }: Props) {
  const wide = span === 'wide'
  // Rango real de diámetros: el menor de los mínimos y el mayor de los máximos no se
  // pueden calcular a partir de un texto libre («1,00 – 3,00 mm»), así que se muestra el
  // recuento y se deja el detalle para la tabla de la ficha. Prometer menos y cumplirlo.
  const alloyCount = line.alloys.length

  return (
    <Link href={href(locale, 'products', line.slug)} className="group block">
      <Media
        image={line.cover}
        alt={line.cover.alt[locale]}
        sizes={wide ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
        ratio={wide ? '16 / 9' : '4 / 3'}
        className="transition-opacity duration-500 group-hover:opacity-90"
      />
      <div className={cn('mt-5', wide && 'md:flex md:items-start md:justify-between md:gap-12')}>
        <div className={cn(wide && 'md:max-w-2xl')}>
          <p className="eyebrow">{dictionary.family[line.family]}</p>
          <h3 className="text-title mt-2 font-semibold">{line.title[locale]}</h3>
          <p className="mt-3 max-w-prose text-graphite-soft">{line.summary[locale]}</p>
        </div>
        {alloyCount > 0 && (
          <p className={cn('eyebrow mt-4 shrink-0', wide && 'md:mt-3')}>
            {alloyCount} {dictionary.line.alloys}
          </p>
        )}
      </div>
    </Link>
  )
}
