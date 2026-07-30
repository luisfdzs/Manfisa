import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Media } from '@/components/ui/Media'
import { cn } from '@/lib/cn'
import type { Company, DescribedImage, ProductLine } from '@/lib/content'
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
 * Columnas del muro. Cada una con **su velocidad y su sentido**: es exactamente eso lo que
 * convierte una rejilla en un muro vivo. Si todas se movieran igual y hacia el mismo lado, el
 * ojo lo leería como una sola imagen grande desplazándose, que es justo lo que no se quiere.
 *
 * `hiddenBelow` recorta columnas en pantallas estrechas: a 390 px caben dos, y meter cuatro
 * sólo produce paneles del tamaño de un sello.
 */
const COLUMNS = [
  { speed: '68s', dir: 'normal', hiddenBelow: null },
  { speed: '92s', dir: 'reverse', hiddenBelow: null },
  { speed: '78s', dir: 'normal', hiddenBelow: 'sm' },
  { speed: '104s', dir: 'reverse', hiddenBelow: 'sm' },
  { speed: '86s', dir: 'normal', hiddenBelow: 'lg' },
  { speed: '118s', dir: 'reverse', hiddenBelow: 'lg' },
] as const

/** Proporciones que se van alternando para que ningún panel mida como su vecino. */
const RATIOS = ['3 / 4', '1 / 1', '4 / 5', '3 / 2', '4 / 3', '1 / 1']

/** Paneles mínimos por columna antes de duplicar para el bucle. Cinco bastan para tapar de
 *  sobra una pantalla girada y sobredimensionada, incluso en la columna más rápida. */
const MIN_PANELS_PER_COLUMN = 5

/** Reparte las imágenes por columnas en zigzag, para que dos fotos parecidas no caigan
 *  seguidas en la misma columna. */
function spread<T>(items: T[], columns: number): T[][] {
  const out: T[][] = Array.from({ length: columns }, () => [])
  items.forEach((item, index) => out[index % columns]!.push(item))
  return out
}

/**
 * Apertura de la web: un **muro de fotografía en movimiento continuo** detrás del titular.
 *
 * La referencia es el hero de sanity.io, y conviene ser preciso sobre qué se copió, porque un
 * primer intento se quedó a medias: allí lo que impacta **no** es un mosaico de piezas fijas,
 * es que decenas de paneles distintos se desplazan sin parar, a distintas velocidades, unos
 * entrando y otros saliendo del encuadre. Eso es lo que se reproduce aquí.
 *
 * Tres decisiones que sostienen el efecto:
 *
 * 1. **Bucle sin costura.** Cada columna repite su contenido dos veces y se desplaza un 50 %
 *    exacto; al reiniciar, el último fotograma es idéntico al primero. Sin ese truco se ve el
 *    salto y el efecto entero se viene abajo.
 * 2. **Velocidades y sentidos distintos** por columna (ver `COLUMNS`).
 * 3. **El velo no cubre todo.** El primer intento oscurecía el muro entero al 45 % y quedaba
 *    un collage apagado. Ahora el degradado es **lateral**: densísimo a la izquierda, donde va
 *    el texto, y casi transparente a la derecha, donde el muro tiene que lucir.
 *
 * Sigue sin haber vídeo, y por lo mismo de antes: son imágenes que hay que descargar de todos
 * modos, el movimiento lo pone CSS, no pesa un byte más y el muro se edita desde el panel.
 *
 * `data-hero` lo lee `globals.css` con `:has()` para poner la cabecera en color metal mientras
 * no se ha hecho scroll. El margen negativo mete el muro bajo la barra: `<header>` es `sticky`
 * y **ocupa su sitio en el flujo**, así que sin esto el menú quedaría metal sobre metal.
 */
export function Hero({ line, company, locale, dictionary }: Props) {
  const source: DescribedImage[] =
    company.heroMontage.length > 0 ? company.heroMontage : [line.cover]
  const columns = spread(source, COLUMNS.length)

  return (
    <section
      data-hero
      className="relative -mt-20 flex min-h-svh flex-col justify-end overflow-hidden bg-inverse md:-mt-24"
    >
      {/* El muro va girado y sobredimensionado a propósito: en diagonal las columnas no
          terminan en una línea recta contra el borde de la pantalla, y al escalar por encima
          del 100 % los paneles sangran por los cuatro lados en vez de dejar esquinas vacías
          al rotar. */}
      <div
        aria-hidden
        // La escala no es estética: al rotar −8° quedan triángulos sin cubrir en dos
        // esquinas, y hay que sobredimensionar lo bastante para que los paneles sangren por
        // los cuatro lados. Con 1,18 se veía el vacío negro abajo a la derecha.
        className="wall absolute inset-0 flex origin-center rotate-[-8deg] scale-[1.6] justify-center gap-(--spacing-wall-gap) md:scale-[1.42]"
      >
        {columns.map((images, columnIndex) => {
          const column = COLUMNS[columnIndex]!
          if (images.length === 0) return null

          // Cada columna necesita cubrir MÁS de una pantalla de alto ella sola: si no, se
          // queda sin paneles a media pasada y aparece un vacío negro (pasó, justo abajo a
          // la derecha). Con doce fotos repartidas en seis columnas tocan a dos, así que se
          // repiten hasta llegar a un mínimo antes de duplicar.
          const base: DescribedImage[] = []
          while (base.length < MIN_PANELS_PER_COLUMN) base.push(...images)
          // El duplicado exacto es lo que permite el bucle sin costura del 50 %.
          const looped = [...base, ...base]

          return (
            <div
              key={columnIndex}
              className={cn(
                'w-1/2 shrink-0 sm:w-1/4 lg:w-1/6',
                column.hiddenBelow === 'sm' && 'hidden sm:block',
                column.hiddenBelow === 'lg' && 'hidden lg:block',
              )}
            >
              <div
                className="wall-column w-full"
                style={{ '--speed': column.speed, '--dir': column.dir } as CSSProperties}
              >
                {looped.map((image, index) => (
                  <Media
                    key={`${image.id}-${index}`}
                    image={image}
                    alt=""
                    sizes="(min-width: 1024px) 17vw, (min-width: 640px) 25vw, 50vw"
                    ratio={RATIOS[(columnIndex + index) % RATIOS.length]}
                    // Sólo el primer panel es prioritario: es el LCP.
                    priority={columnIndex === 0 && index === 0}
                    quality={75}
                    // Nada de bajar el brillo aquí: se probó y los bodegones sobre fondo
                    // blanco pasaban de parche luminoso a mancha gris turbia, que es peor.
                    // El contraste lo pone el degradado lateral, no un filtro sobre la foto.
                    className="contrast-[1.05]"
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Velo LATERAL, no general: denso donde está el texto y transparente donde el muro
          tiene que lucir. Se le suma uno arriba para la cabecera —que sobre un panel claro
          desaparecería— y un pie oscuro que ata el hero con la sección siguiente. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-inverse from-15% via-inverse/70 via-55% to-transparent"
      />
      <div
        aria-hidden
        // Denso de verdad: el muro ya no está oscurecido en bloque, así que la cabecera cae
        // sobre paneles que pueden ser muy claros y este es su único respaldo.
        className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-inverse/95 via-inverse/60 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-inverse to-transparent"
      />

      <div className="page-gutter relative pb-16 text-metal md:pb-24">
        <p className="eyebrow text-metal/70">{dictionary.products.title}</p>
        <h1 className="text-display mt-4 max-w-3xl font-semibold text-balance">
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
