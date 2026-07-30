import type { SupplyFormat } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  supply: SupplyFormat[]
  locale: Locale
  dictionary: Dictionary
}

/** Formatos de suministro: bobina, peso y embalaje. Tres columnas fijas, siempre llenas
 *  (el esquema las exige), así que aquí no hay columnas condicionales que resolver. */
export function SupplyTable({ supply, locale, dictionary }: Props) {
  if (supply.length === 0) return null

  return (
    <div className="overflow-x-auto">
      <table className="spec-table min-w-xl">
        <thead>
          <tr>
            <th scope="col">{dictionary.line.format}</th>
            <th scope="col" data-numeric>
              {dictionary.line.weight}
            </th>
            <th scope="col">{dictionary.line.packaging}</th>
          </tr>
        </thead>
        <tbody>
          {supply.map((format) => (
            <tr key={format.format[locale]}>
              <th scope="row" className="font-normal">
                {format.format[locale]}
              </th>
              <td data-numeric className="whitespace-nowrap">
                {format.weight}
              </td>
              <td>{format.packaging[locale]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
