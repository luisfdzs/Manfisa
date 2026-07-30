/**
 * Constantes técnicas del sitio, las únicas que NO se editan desde el panel.
 *
 * Todo lo editorial —descripción de la empresa, líneas de producto, aleaciones, datos
 * de contacto— vive en el panel de administración, para que Manfisa pueda cambiarlo sin
 * pasar por desarrollo. Aquí queda sólo lo que define el despliegue: el nombre de la
 * marca, la razón social y el dominio canónico, que se usan para las URLs absolutas, el
 * sitemap, los metadatos y el marcado de datos estructurados.
 */
export const site = {
  name: 'Manfisa',
  /** Razón social de la sociedad que fabrica el hilo de aluminio. */
  legalName: 'Manfisa Wire, S.L.',
  /** Sociedad matriz del grupo (holding desde el 1 de enero de 2021). */
  parentName: 'Manufacturas Irular, S.A.',
  /** Dominio canónico de producción. */
  url: 'https://www.manfisa.com',
} as const
