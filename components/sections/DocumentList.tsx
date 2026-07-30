import type { TechnicalDocument } from '@/lib/content'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

type Props = {
  documents: TechnicalDocument[]
  locale: Locale
  dictionary: Dictionary
}

/** Peso en la unidad que se entiende, para que nadie pulse un PDF de 40 MB desde el móvil
 *  sin saberlo. Se calcula aquí y no en el panel: el tamaño lo sabe Sanity, no quien sube
 *  el archivo. */
function formatSize(bytes: number): string {
  const mb = bytes / 1_000_000
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1000)} kB`
}

/**
 * Descargas técnicas: ficha técnica, ficha de seguridad, certificados.
 *
 * Es la sección que más se usa de una web industrial y la que peor se suele resolver. Tres
 * detalles deliberados: el enlace dice el **tipo y el peso** del archivo; lleva `download`
 * para que el navegador guarde en vez de abrir un visor; y **no** lleva `target="_blank"`,
 * porque con `download` una pestaña nueva se abriría y se cerraría sola.
 */
export function DocumentList({ documents, locale, dictionary }: Props) {
  if (documents.length === 0) return null

  return (
    <ul className="mt-8 divide-y divide-line border-t border-line">
      {documents.map((document) => (
        <li key={document.url}>
          <a
            href={document.url}
            download
            className="group flex items-baseline justify-between gap-6 py-4"
          >
            <span className="link-underline text-accent">{document.label[locale]}</span>
            <span className="eyebrow shrink-0">
              PDF{document.size ? ` · ${formatSize(document.size)}` : ''}
              <span className="sr-only"> — {dictionary.line.download}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
