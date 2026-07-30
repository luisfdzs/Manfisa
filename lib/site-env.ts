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
 */
export const INDEXABLE_BRANCH = 'main'

export function isIndexable(): boolean {
  return (
    process.env.VERCEL_ENV === 'production' &&
    process.env.VERCEL_GIT_COMMIT_REF === INDEXABLE_BRANCH
  )
}
