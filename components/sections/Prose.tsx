import { cn } from '@/lib/cn'

/**
 * Bloque de párrafos. El contenido llega como lista de textos (ver `localizedParagraphs`
 * en los esquemas), no como HTML: aquí es donde se convierte en tipografía, y por eso el
 * ancho de línea se limita en un solo sitio.
 *
 * `max-w-prose` no es un capricho: por encima de ~75 caracteres por línea el ojo pierde el
 * renglón al volver a la izquierda, y una descripción técnica se lee entera o no se lee.
 */
export function Prose({ paragraphs, className }: { paragraphs: string[]; className?: string }) {
  return (
    <div className={cn('max-w-prose space-y-5', className)}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}

/**
 * Título de sección interior: etiqueta en versalitas + filete. Se repite en cada bloque de
 * la ficha de producto y de las páginas de calidad y empresa, así que vive aquí en vez de
 * copiarse siete veces con espaciados que acaban divergiendo.
 */
export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h2 className={cn('eyebrow border-b border-line pb-4', className)}>{children}</h2>
}

/** Lista de frases cortas (aplicaciones, valores). Numerada en mono: en una ficha técnica
 *  el número ayuda a citar («el punto 3») y el bullet redondo no. */
export function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
      {items.map((item, index) => (
        <li key={item} className="flex gap-4">
          <span className="eyebrow mt-1 shrink-0 tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  )
}
