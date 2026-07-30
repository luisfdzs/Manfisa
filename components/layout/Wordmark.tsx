import { cn } from '@/lib/cn'

/**
 * Wordmark de Manfisa: una marca de bobina + el nombre.
 *
 * ⚠️ **PROVISIONAL.** Es un montaje tipográfico, no el logotipo oficial de la casa.
 * Cuando exista el vector real, se sustituye el `<svg>` de la marca y el `<span>` del
 * nombre por los trazos, y nada más de la web tiene que cambiar: la cabecera y el pie
 * consumen este componente y sólo le pasan una altura.
 *
 * **Por qué la marca es SVG en línea y no `<img src="…svg">`:** `stroke="currentColor"`.
 * La cabecera es transparente sobre el hero (trazo en color metal) y pasa a fondo claro al
 * bajar (trazo en grafito), y eso se consigue heredando el color del contexto. Un fichero
 * externo no hereda nada: haría falta duplicarlo en dos colores y cambiarlo por CSS.
 *
 * El nombre va en `<span>` y no en un `<text>` de SVG por la misma razón por la que el
 * texto de la web va en HTML: se puede seleccionar, se lee con lector de pantalla y usa la
 * fuente ya descargada, sin un segundo trazado que mantener.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      {/* Sección de una bobina: tres vueltas de hilo vistas de canto. */}
      <svg
        viewBox="0 0 24 24"
        className="h-[0.9em] w-auto shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="10.2" />
        <circle cx="12" cy="12" r="6.4" />
        <circle cx="12" cy="12" r="2.6" />
      </svg>
      <span className="font-semibold tracking-[0.22em] uppercase">Manfisa</span>
    </span>
  )
}
