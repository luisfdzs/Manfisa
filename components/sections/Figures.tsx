import type { Company } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  company: Company
  locale: Locale
  dictionary: Dictionary
}

/**
 * Banda oscura con las cifras de planta: año de fundación, capacidad, facturación.
 *
 * Va sobre fondo `inverse` porque es el único bloque de la web que interrumpe la lectura a
 * propósito: en B2B, la capacidad instalada y los años de fábrica son el argumento que
 * decide si te piden muestra, y se leen de un vistazo o no se leen.
 *
 * Las cifras llegan del panel ya formateadas («3.500 t/año»): formatearlas aquí obligaría
 * a modelar unidades y separadores de miles en tres idiomas para ganar nada.
 */
export function Figures({ company, locale, dictionary }: Props) {
  return (
    <section className="bg-inverse text-metal">
      <div className="page-gutter py-(--spacing-section)">
        <h2 className="eyebrow text-metal/40">{dictionary.home.figures}</h2>
        <dl className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {company.figures.map((figure) => (
            <div key={figure.value}>
              {/* <dd> antes que <dt> en el orden visual: la cifra manda y la etiqueta la
                  explica. En HTML el par sigue siendo válido y los lectores de pantalla lo
                  anuncian igual, porque lo que los empareja es el <div>, no el orden. */}
              <dd className="text-figure font-mono font-medium tabular-nums">{figure.value}</dd>
              <dt className="mt-3 text-small text-metal/60">{figure.label[locale]}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
