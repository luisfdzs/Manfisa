import type { Locale } from './config'

/**
 * Rutas del sitio en un único sitio. Los segmentos son neutros (`/products`,
 * `/quality`) para que los tres idiomas compartan estructura de ficheros; si algún día
 * queremos slugs localizados (`/es/productos`), se resuelve aquí con un mapa sin tocar
 * ninguna página.
 *
 * A diferencia de una web de portfolio, aquí **empresa y calidad SÍ son páginas**, no
 * secciones de la portada: en B2B industrial son las dos que se enlazan desde fuera
 * (fichas de proveedor, auditorías de cliente, pliegos) y las que se buscan por su
 * nombre. Una ancla no se puede citar en un pliego.
 */
export const routes = {
  home: '',
  products: 'products',
  quality: 'quality',
  company: 'company',
  contact: 'contact',
} as const

export type RouteKey = keyof typeof routes

/** Construye una URL absoluta dentro del sitio: href('en', 'products', 'metallizing')
 *  → `/en/products/metallizing`.
 *
 *  La barra inicial se añade aparte a propósito: metida como cadena vacía dentro del
 *  array, `filter(Boolean)` se la come y devuelve `en/products` (relativa), que desde
 *  una página interior el navegador encadena → `/en/products/en/products` → 404. */
export function href(locale: Locale, key: RouteKey, ...segments: string[]): string {
  const parts = [locale, routes[key], ...segments].filter(Boolean)
  return `/${parts.join('/')}`
}

/** Entradas del menú, en el orden en que se leen. `as const satisfies` para que el tipo
 *  sea la unión exacta de claves (sin `home`) y el diccionario pueda indexarse sin
 *  comprobaciones extra. */
export const navigation = [
  'products',
  'quality',
  'company',
  'contact',
] as const satisfies readonly RouteKey[]

export type NavKey = (typeof navigation)[number]
