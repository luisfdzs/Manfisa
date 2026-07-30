import Link from 'next/link'
import { Media } from '@/components/ui/Media'
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
 * Apertura a pantalla completa con la portada de la primera línea destacada.
 *
 * `data-hero` no es decoración: es la marca que lee `globals.css` con `:has()` para poner
 * la cabecera en color metal mientras no se ha hecho scroll. Sin ese atributo, el menú
 * saldría en grafito sobre una foto oscura.
 *
 * La altura usa `svh` y no `vh` para que en móvil no la corte la barra del navegador.
 */
export function Hero({ line, company, locale, dictionary }: Props) {
  return (
    /* El margen negativo NO es un truco de maquetación: es lo que hace que la cabecera
       transparente funcione. `<header>` es `sticky top-0`, y un elemento sticky **ocupa su
       sitio en el flujo**, así que sin esto el hero empieza 80 px por debajo y el menú —que
       mientras no se hace scroll se pinta en color metal— queda metal sobre metal, es decir,
       invisible. Subir el hero esos mismos 80/96 px lo mete debajo de la barra, que es donde
       el diseño da por supuesto que está la foto.

       Los valores tienen que coincidir con la altura de la barra en `Header.tsx` (h-20 / h-24
       en md). Si allí cambia, aquí también. */
    <section data-hero className="relative -mt-20 flex min-h-svh flex-col justify-end md:-mt-24">
      <div className="absolute inset-0">
        {/* La ÚNICA imagen con `priority` de toda la página: es el LCP. */}
        <Media
          image={line.cover}
          alt={line.cover.alt[locale]}
          sizes="100vw"
          priority
          quality={82}
          ratio="auto"
          className="h-full"
        />
        {/* DOS velos, no uno, y cada uno protege un texto distinto.

            El de abajo es para el titular. El de ARRIBA es para la cabecera, y hace falta
            porque mientras no se ha hecho scroll el menú se pinta en color metal sobre la
            foto (ver `:has()` en globals.css): con una imagen clara en la parte superior
            —una nave iluminada, un cielo, una bobina pulida— el logotipo y los cinco
            enlaces del menú desaparecen. Pasó con la primera imagen que se subió, y a
            1440 px no se notaba enseguida porque el ojo ya sabe dónde está el menú.

            Sale más barato garantizar el contraste aquí que pedir que todas las fotos de
            planta sean oscuras por arriba: quien sube la foto no tiene por qué saberlo. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-inverse/70 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-inverse/85 via-inverse/35 to-transparent"
        />
      </div>

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
