import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Media } from '@/components/ui/Media'
import { cn } from '@/lib/cn'
import type { Company, ProductLine } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { href } from '@/lib/i18n/routes'

type Props = {
  line: ProductLine
  company: Company
  locale: Locale
  dictionary: Dictionary
}

/**
 * Colocación de las piezas del mosaico sobre una rejilla de 12×6.
 *
 * Son deliberadamente **desiguales**: una pieza dominante y cinco satélites de tamaños
 * distintos. Una cuadrícula regular se lee como una galería de banco de imágenes; lo que hace
 * que un mosaico parezca vivo es que ninguna pieza mida lo mismo que su vecina.
 *
 * `hiddenBelowMd` marca las que desaparecen en móvil: a 390 px de ancho, seis fotos son seis
 * manchas. Se quedan las tres primeras, que son las buenas.
 */
type Tile = {
  colSpan: number
  rowSpan: number
  col: number
  row: number
  sizes: string
  /** Se oculta por debajo de `md`. Sin el tipo explícito, `as const` haría que las piezas
   *  que no declaran el campo no lo admitan siquiera al leerlo. */
  hiddenBelowMd?: boolean
}

const TILES: readonly Tile[] = [
  { colSpan: 7, rowSpan: 4, col: 1, row: 1, sizes: '(min-width: 768px) 58vw, 100vw' },
  { colSpan: 5, rowSpan: 3, col: 8, row: 1, sizes: '(min-width: 768px) 42vw, 100vw' },
  { colSpan: 7, rowSpan: 2, col: 1, row: 5, sizes: '(min-width: 768px) 58vw, 100vw' },
  { colSpan: 2, rowSpan: 3, col: 8, row: 4, sizes: '17vw', hiddenBelowMd: true },
  { colSpan: 3, rowSpan: 3, col: 10, row: 4, sizes: '25vw', hiddenBelowMd: true },
]

/**
 * Apertura de la web: un mosaico de fotografía de planta con movimiento lento, al modo del
 * hero de sanity.io pero con material propio de Manfisa.
 *
 * **No hay vídeo, y es a propósito.** Un hero en vídeo son megabytes que compiten
 * directamente con el LCP, y en móvil el autoplay es un campo de minas. El movimiento se hace
 * con un zoom lento por CSS (utilidad `montage-tile` en globals.css) sobre imágenes que de
 * todos modos hay que descargar: mismo efecto percibido, cero peso añadido, y el mosaico lo
 * cambia cualquiera desde el panel porque son sólo imágenes.
 *
 * `data-hero` no es decoración: lo lee `globals.css` con `:has()` para poner la cabecera en
 * color metal mientras no se ha hecho scroll.
 *
 * El margen negativo mete el mosaico bajo la barra: `<header>` es `sticky` y **ocupa su sitio
 * en el flujo**, así que sin esto el hero empezaría 80 px más abajo y el menú quedaría metal
 * sobre metal, es decir invisible. Los valores tienen que coincidir con la altura de la barra
 * en `Header.tsx` (h-20 / h-24 en md).
 */
export function Hero({ line, company, locale, dictionary }: Props) {
  // El mosaico manda; si el panel se quedara sin imágenes, se cae con elegancia a la portada
  // de la primera línea destacada, que siempre existe.
  const images = company.heroMontage.length > 0 ? company.heroMontage : [line.cover]
  const tiles = TILES.slice(0, Math.min(Math.max(images.length, 3), TILES.length))

  return (
    <section
      data-hero
      className="relative -mt-20 flex min-h-svh flex-col justify-end overflow-hidden md:-mt-24"
    >
      <div aria-hidden className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-1.5 p-1.5">
        {tiles.map((tile, index) => {
          const image = images[index % images.length]!
          return (
            <div
              key={`${image.id}-${index}`}
              className={cn('montage-tile', tile.hiddenBelowMd && 'hidden md:block')}
              style={
                {
                  gridColumn: `${tile.col} / span ${tile.colSpan}`,
                  gridRow: `${tile.row} / span ${tile.rowSpan}`,
                  // Escalonado: cada pieza entra un poco después y deriva a distinto ritmo,
                  // para que el conjunto nunca lata al unísono.
                  animationDelay: `${index * 110}ms`,
                  '--drift': `${22 + index * 4}s`,
                } as CSSProperties
              }
            >
              <Media
                image={image}
                // Decorativa: el mosaico vive dentro de un contenedor `aria-hidden`, y quien
                // usa lector de pantalla necesita el titular, no seis descripciones de foto.
                alt=""
                sizes={tile.sizes}
                // Sólo la pieza dominante es prioritaria: es el LCP de la página.
                priority={index === 0}
                quality={index === 0 ? 82 : 75}
                ratio="auto"
                className="h-full"
              />
            </div>
          )
        })}
      </div>

      {/* Tres velos, y cada uno hace un trabajo distinto:
          1. uno general, porque un mosaico de seis fotos compite con el texto y si no se
             apaga no gana ninguno de los dos;
          2. arriba, para la cabecera, que sobre las piezas claras (los bodegones sobre fondo
             blanco) desaparecería;
          3. abajo, para que el titular se lea sea cual sea la foto que pongan en el panel. */}
      <div aria-hidden className="absolute inset-0 bg-inverse/45" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-inverse/80 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-inverse via-inverse/55 to-transparent"
      />

      <div className="page-gutter relative pb-16 text-metal md:pb-24">
        <p className="eyebrow text-metal/70">{dictionary.products.title}</p>
        <h1 className="text-display mt-4 max-w-4xl font-semibold text-balance">
          {company.claim[locale]}
        </h1>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href={href(locale, 'products')}
            className="link-underline tap text-small tracking-wide"
          >
            {dictionary.home.viewAllProducts}
          </Link>
          <Link
            href={href(locale, 'quality')}
            className="link-underline tap text-small tracking-wide text-metal/70"
          >
            {dictionary.home.qualityCta}
          </Link>
        </div>
      </div>
    </section>
  )
}
