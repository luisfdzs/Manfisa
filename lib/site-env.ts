/**
 * ¿Este despliegue debe aparecer en Google?
 *
 * **Sólo la rama `main`.** Y se decide por la rama, no por `VERCEL_ENV`, porque el
 * proyecto de test despliega la rama `test` **como su propio entorno de producción**:
 * allí `VERCEL_ENV === 'production'` también. Usar esa variable dejaría el entorno de
 * pruebas con `index, follow` y `Allow: /`, es decir, compitiendo en Google con el
 * dominio real por el mismo contenido — y en B2B, donde el tráfico de marca es casi
 * todo el tráfico, duplicar la web es regalarle a un competidor el primer resultado.
 *
 * `VERCEL_GIT_COMMIT_REF` trae la rama desplegada y no hay que configurar nada:
 *
 *   proyecto `manfisa`      rama `main`  → indexable
 *   proyecto `manfisatest`  rama `test`  → NO indexable
 *   previews de cualquier rama           → NO indexable
 *   desarrollo local (sin variables)     → NO indexable
 *
 * Falla del lado seguro: si mañana falta la variable, no se indexa.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * INTERRUPTOR EXPLÍCITO: `SITE_INDEXABLE`
 * ─────────────────────────────────────────────────────────────────────────────
 * Cumplir la condición de rama ya no basta: hace falta además que
 * `SITE_INDEXABLE` valga `'true'` en el entorno.
 *
 * Está porque la web vive en `main` **antes** de que Manfisa haya validado las tablas de
 * aleaciones, la capacidad instalada y las certificaciones (ver la memoria
 * `pendientes-manfisa`). Sin este interruptor, el simple hecho de alinear las ramas
 * publicaría en Google especificaciones técnicas sin confirmar a nombre de una empresa
 * real — y un comprador que pida una aleación anunciada que no se fabrica no vuelve.
 *
 * Es un candado deliberado, no un residuo: **quitarlo es la última tarea antes de salir a
 * producción**, y se hace en un sitio (Vercel › proyecto `manfisa` › Settings ›
 * Environment Variables › `SITE_INDEXABLE=true`, entorno Production) sin tocar código.
 * Mientras no exista la variable, no se indexa nada.
 */
export const INDEXABLE_BRANCH = 'main'

export function isIndexable(): boolean {
  return (
    process.env.SITE_INDEXABLE === 'true' &&
    process.env.VERCEL_ENV === 'production' &&
    process.env.VERCEL_GIT_COMMIT_REF === INDEXABLE_BRANCH
  )
}
