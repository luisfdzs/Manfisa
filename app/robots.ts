import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { isIndexable } from '@/lib/site-env'

/**
 * Sólo la rama `main` se indexa. El entorno de test devuelve `disallow: /` para no competir
 * en Google con el dominio real. El criterio vive en `lib/site-env.ts`, con el porqué.
 *
 * `/admin` se excluye siempre, incluso en producción: es el panel, no contenido.
 */
export default function robots(): MetadataRoute.Robots {
  const indexable = isIndexable()

  return {
    rules: indexable
      ? { userAgent: '*', allow: '/', disallow: '/admin' }
      : { userAgent: '*', disallow: '/' },
    sitemap: indexable ? `${site.url}/sitemap.xml` : undefined,
  }
}
