import type { Alloy } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  alloys: Alloy[]
  locale: Locale
  dictionary: Dictionary
}

/**
 * Tabla de aleaciones.
 *
 * Tres decisiones que la hacen usable de verdad y que son fáciles de perder al retocar:
 *
 * 1. **Las columnas opcionales se omiten si ninguna fila las rellena.** Una columna
 *    «Resistencia» con seis guiones no informa de nada y roba el ancho que necesitan las
 *    que sí tienen datos — y en móvil ese ancho es todo lo que hay.
 * 2. **Envuelta en un contenedor con `overflow-x: auto`.** Es la única forma de que una
 *    tabla de cinco columnas quepa en 390 px sin que la PÁGINA desborde en horizontal, que
 *    es el fallo clásico de un catálogo en móvil.
 * 3. **La designación es `<th scope="row">`.** Es la cabecera de su fila: con lector de
 *    pantalla, cada celda se anuncia como «EN AW-1080A, diámetros, 1,00 – 3,00 mm» en vez
 *    de leer veinte números sueltos.
 */
export function AlloyTable({ alloys, locale, dictionary }: Props) {
  if (alloys.length === 0) return null

  const hasTensile = alloys.some((alloy) => alloy.tensile)
  const hasElongation = alloys.some((alloy) => alloy.elongation)
  const hasNote = alloys.some((alloy) => alloy.note)

  return (
    <div className="overflow-x-auto">
      <table className="spec-table min-w-2xl">
        <thead>
          <tr>
            <th scope="col">{dictionary.line.alloy}</th>
            <th scope="col">{dictionary.line.purity}</th>
            {hasTensile && (
              <th scope="col" data-numeric>
                {dictionary.line.tensile}
              </th>
            )}
            {hasElongation && (
              <th scope="col" data-numeric>
                {dictionary.line.elongation}
              </th>
            )}
            <th scope="col" data-numeric>
              {dictionary.line.diameter}
            </th>
            {hasNote && <th scope="col">&nbsp;</th>}
          </tr>
        </thead>
        <tbody>
          {alloys.map((alloy) => (
            <tr key={alloy.designation}>
              <th scope="row" className="font-mono font-normal whitespace-nowrap">
                {alloy.designation}
              </th>
              <td>{alloy.purity}</td>
              {hasTensile && <td data-numeric>{alloy.tensile ?? '—'}</td>}
              {hasElongation && <td data-numeric>{alloy.elongation ?? '—'}</td>}
              <td data-numeric className="whitespace-nowrap">
                {alloy.diameters}
              </td>
              {hasNote && <td className="text-graphite-soft">{alloy.note?.[locale] ?? ''}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
