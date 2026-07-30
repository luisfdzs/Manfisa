export const locales = ['es', 'en', 'fr'] as const
export const defaultLocale = 'es' satisfies Locale

export type Locale = (typeof locales)[number]

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Etiquetas del selector de idioma. */
export const localeNames: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  fr: 'FR',
}

/** `hreflang` para los alternates de SEO. */
export const localeHtmlLang: Record<Locale, string> = {
  es: 'es-ES',
  en: 'en',
  fr: 'fr',
}

/**
 * Un texto que existe en los tres idiomas. Todo el contenido pasa por esta forma, de
 * modo que añadir un idioma sea ampliar `locales` y que TypeScript señale exactamente
 * qué falta traducir en vez de dejar huecos vacíos en la web.
 *
 * Por qué tres idiomas y no dos: Manfisa vende a Europa (el mercado de la metalización
 * de film y papel está en Francia, Italia y Alemania) y el francés es el segundo idioma
 * comercial real de la casa después del inglés.
 */
export type Localized<T = string> = Record<Locale, T>

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale]
}
