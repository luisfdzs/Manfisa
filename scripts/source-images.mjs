/**
 * CATÁLOGO DE IMÁGENES DE ORIGEN
 *
 * Todas salen de **manfisa.com**: son fotografías propias de la casa, así que no hay
 * problema de licencia ni de verosimilitud — es su producto real, no un banco de imágenes.
 *
 * Se buscó stock libre para rellenar ambiente de planta y se **descartó**:
 *  - Wikimedia Commons y Openverse sólo daban material relevante en **CC BY-SA**, que
 *    arrastra atribución visible y *share-alike* sobre los recortes. En una web corporativa
 *    eso es una obligación permanente a cambio de una foto de relleno.
 *  - Unsplash y Pexels sí permiten uso comercial sin atribución, pero **exigen clave de API**
 *    para descargar de forma programática.
 *
 * ⚠️ LIMITACIÓN CONOCIDA DEL MATERIAL: varias fotos de formato (`rollos_*`, `rosaceas_*`,
 * `fundicion_*`) sólo existen en manfisa.com a **329×168 px**. Por eso **ninguna de ellas se
 * usa como portada**: las portadas salen siempre de las imágenes grandes, y las pequeñas
 * quedan en la galería, que se pinta a tres columnas para que nunca se amplíen. Si Manfisa
 * manda los originales, se sustituyen en `/admin` y no hay que tocar código.
 *
 * Los ficheros NO se versionan: `npm run images` los descarga a `assets-src/` (gitignorado).
 * El repositorio no engorda con binarios que ya viven en manfisa.com y en la CDN de Sanity.
 */

export const BASE = 'https://www.manfisa.com/sites/default/files'

/**
 * Mosaico del hero. El orden importa: el primero abre, ocupa la pieza grande y hace de LCP.
 *
 * ⚠️ Aquí NO entra `cabecera_slider_port_carpeta.jpg`, aunque la textura de hilo sea
 * preciosa: lleva **el logotipo «manfisa» incrustado en el propio pixel**. En una pieza del
 * mosaico sale recortado a media palabra y parece un error de maquetación. Sirve para una
 * cabecera a sangre en su web, no para un mosaico.
 */
export const MONTAGE = [
  {
    file: 'slider_oa.jpg',
    alt: {
      es: 'Primer plano de hilos de aluminio brillante recién trefilados, alineados en diagonal',
      en: 'Close-up of freshly drawn bright aluminium wires, aligned diagonally',
      fr: 'Gros plan de fils d’aluminium brillants fraîchement tréfilés, alignés en diagonale',
    },
  },
  {
    file: 'k44_cesta_metalica.jpg',
    alt: {
      es: 'Bobina K44 de gran capacidad asentada en su cesta metálica de transporte',
      en: 'High-capacity K44 coil sitting in its metal shipping basket',
      fr: 'Bobine K44 grande capacité posée dans son panier métallique de transport',
    },
  },
  {
    file: 'md-slider-image/slider_home_bobinas.jpg',
    alt: {
      es: 'Tres bobinas de hilo de aluminio para alimentación automática',
      en: 'Three spools of aluminium wire for automatic feeding',
      fr: 'Trois bobines de fil d’aluminium pour alimentation automatique',
    },
  },
  {
    file: 'Granalla.jpg',
    alt: {
      es: 'Lingotes y granalla de aluminio de distintos calibres',
      en: 'Aluminium ingots and shot in various sizes',
      fr: 'Lingots et grenaille d’aluminium de différents calibres',
    },
  },
  {
    file: 'slider_soldadura_3ok.jpg',
    alt: {
      es: 'Gama de formatos de hilo de soldadura: bobinas, rollos y bidones',
      en: 'Range of welding wire formats: spools, coils and drums',
      fr: 'Gamme de formats de fil de soudage : bobines, couronnes et fûts',
    },
  },
]

/**
 * Galería por línea de producto. **El primer elemento es la portada** y sale siempre de una
 * imagen grande (ver la limitación de arriba).
 */
export const GALLERIES = {
  metallizing: [
    {
      file: 'k44_cesta_metalica.jpg',
      alt: {
        es: 'Bobina de gran capacidad de hilo para metalización, en cesta metálica',
        en: 'High-capacity coil of metallizing wire in a metal basket',
        fr: 'Bobine grande capacité de fil de métallisation, en panier métallique',
      },
    },
    {
      file: 'rollos_gran_capacidad_0.jpg',
      alt: {
        es: 'Rollo de gran capacidad sobre palé, listo para expedición',
        en: 'High-capacity coil on a pallet, ready for dispatch',
        fr: 'Couronne grande capacité sur palette, prête à l’expédition',
      },
    },
    {
      file: 'rollos_estaticos_0.jpg',
      alt: {
        es: 'Rollo estático bobinado capa a capa, sin empalmes',
        en: 'Static coil wound layer by layer, joint free',
        fr: 'Couronne statique bobinée couche par couche, sans raccord',
      },
    },
  ],
  welding: [
    {
      file: 'slider_soldadura_3ok.jpg',
      alt: {
        es: 'Gama completa de formatos de hilo de soldadura de aluminio',
        en: 'Full range of aluminium welding wire formats',
        fr: 'Gamme complète de formats de fil de soudage aluminium',
      },
    },
    {
      file: 'S300.jpg',
      alt: {
        es: 'Bobina S300 de hilo de soldadura, para alimentación en MIG',
        en: 'S300 welding wire spool, for MIG feeding',
        fr: 'Bobine S300 de fil de soudage, pour alimentation MIG',
      },
    },
    {
      file: 'B300-K335.jpg',
      alt: {
        es: 'Bobinas B300 y K335, los dos formatos de mayor capacidad',
        en: 'B300 and K335 spools, the two highest-capacity formats',
        fr: 'Bobines B300 et K335, les deux formats de plus grande capacité',
      },
    },
    {
      file: 'Octavin.jpg',
      alt: {
        es: 'Embalaje octogonal Octavin, para consumo continuo en robot',
        en: 'Octavin octagonal pack, for continuous robot feeding',
        fr: 'Emballage octogonal Octavin, pour alimentation continue en robot',
      },
    },
  ],
  mechanical: [
    {
      file: 'slider_oa.jpg',
      alt: {
        es: 'Hilo de aluminio trefilado con la dureza ajustada al conformado en frío',
        en: 'Drawn aluminium wire with hardness matched to cold forming',
        fr: 'Fil d’aluminium tréfilé, dureté adaptée au formage à froid',
      },
    },
    {
      file: 'rollos_standar_0.jpg',
      alt: {
        es: 'Rollo estándar en corona, el formato habitual para prensa',
        en: 'Standard coil, the usual format for press feeding',
        fr: 'Couronne standard, le format habituel pour presse',
      },
    },
    {
      file: 'rosaceas_metalicas_0.jpg',
      alt: {
        es: 'Rosáceas metálicas con hilo devanado para alimentación continua',
        en: 'Metal rosettes with wound wire for continuous feeding',
        fr: 'Rosaces métalliques avec fil enroulé pour alimentation continue',
      },
    },
    {
      file: 'rollos_conicos_0.jpg',
      alt: {
        es: 'Rollos cónicos, pensados para desbobinado sin torsión',
        en: 'Conical coils, designed for twist-free payoff',
        fr: 'Couronnes coniques, conçues pour un dévidage sans torsion',
      },
    },
  ],
  casting: [
    {
      file: 'Granalla.jpg',
      alt: {
        es: 'Lingotes y granalla de aluminio para carga de horno',
        en: 'Aluminium ingots and shot for furnace charging',
        fr: 'Lingots et grenaille d’aluminium pour chargement de four',
      },
    },
    {
      file: 'Bidones.jpg',
      alt: {
        es: 'Bidones de hilo para inyección en cuchara de acería',
        en: 'Drums of wire for injection into the steel ladle',
        fr: 'Fûts de fil pour injection en poche d’aciérie',
      },
    },
    {
      file: 'Bidon_cubo.jpg',
      alt: {
        es: 'Bidón y cubo, los dos envases para hilo de desoxidación',
        en: 'Drum and pail, the two containers for deoxidation wire',
        fr: 'Fût et seau, les deux contenants pour fil de désoxydation',
      },
    },
  ],
  electrical: [
    // Reutiliza la foto de bobinas: es grande, y unas bobinas son exactamente lo que se
    // monta en una devanadora de motor. Mejor repetir una imagen buena que estrenar una
    // borrosa de 329 px.
    {
      file: 'md-slider-image/slider_home_bobinas.jpg',
      alt: {
        es: 'Bobinas de hilo de aluminio de conductividad garantizada, listas para bobinar',
        en: 'Spools of aluminium wire with guaranteed conductivity, ready for winding',
        fr: 'Bobines de fil d’aluminium à conductivité garantie, prêtes à bobiner',
      },
    },
    {
      file: 'rollos_aplicaciones_especiales_2.jpg',
      alt: {
        es: 'Rollo para aplicaciones especiales, con conductividad garantizada por lote',
        en: 'Coil for special applications, with conductivity guaranteed per batch',
        fr: 'Couronne pour applications spéciales, à conductivité garantie par lot',
      },
    },
    {
      file: 'bobinas_plastic.jpg',
      alt: {
        es: 'Bobinas de plástico con hilo fino para bobinado de motores',
        en: 'Plastic spools with fine wire for motor winding',
        fr: 'Bobines plastique avec fil fin pour bobinage de moteurs',
      },
    },
  ],
}

/** Todos los ficheros distintos que hay que descargar. */
export const ALL_FILES = [
  ...new Set([...MONTAGE, ...Object.values(GALLERIES).flat()].map((i) => i.file)),
]

/** Nombre plano y estable para el fichero procesado. */
export const slugify = (file) =>
  file
    .split('/')
    .pop()
    .replace(/\.[a-z]+$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
