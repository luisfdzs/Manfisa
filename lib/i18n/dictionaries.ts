import type { Locale } from './config'

/**
 * Textos de INTERFAZ (no de contenido: eso vive en el panel).
 *
 * El diccionario `es` es la fuente de verdad de la forma: `en` y `fr` deben encajar en
 * el mismo tipo, así que si añades una clave y no la traduces, **falla el typecheck** en
 * lugar de aparecer vacía en la web. Con tres idiomas esto deja de ser un detalle: el
 * francés es el que se olvida.
 */
const es = {
  nav: {
    home: 'Inicio',
    products: 'Productos',
    quality: 'Calidad',
    company: 'Empresa',
    contact: 'Contacto',
    menu: 'Menú',
    close: 'Cerrar',
    skipToContent: 'Saltar al contenido',
  },
  home: {
    productLines: 'Líneas de producto',
    viewAllProducts: 'Ver todos los productos',
    figures: 'Manfisa en cifras',
    qualityTitle: 'Control de proceso, colada a colada',
    qualityCta: 'Cómo controlamos la calidad',
    companyCta: 'Conocer la empresa',
    contactTitle: '¿Necesita una aleación concreta?',
    contactLead:
      'Cuéntenos la aplicación y el formato de suministro que necesita. Le respondemos con una propuesta técnica.',
    contactCta: 'Hablar con el equipo técnico',
  },
  products: {
    title: 'Productos',
    lead: 'Hilo de aluminio trefilado y aleaciones para metalización, soldadura, aplicaciones mecánicas y fundición.',
    empty: 'No hay líneas de producto publicadas todavía.',
    viewLine: 'Ver la línea',
    family: 'Familia',
  },
  line: {
    applications: 'Aplicaciones',
    alloys: 'Aleaciones',
    supply: 'Formatos de suministro',
    downloads: 'Documentación técnica',
    advice: 'Asesoramiento técnico',
    adviceLead:
      'Si su aplicación no encaja con ninguna de las aleaciones de la tabla, la estudiamos: buena parte de lo que fabricamos nació de una especificación de cliente.',
    backToProducts: 'Volver a productos',
    next: 'Siguiente línea',
    previous: 'Línea anterior',
    gallery: 'Imágenes',
    alloy: 'Aleación',
    purity: 'Pureza / composición',
    tensile: 'Resistencia',
    elongation: 'Alargamiento',
    diameter: 'Diámetros',
    format: 'Formato',
    weight: 'Peso',
    packaging: 'Embalaje',
    download: 'Descargar',
  },
  quality: {
    title: 'Calidad',
    lead: 'Cada bobina se ensaya antes, durante y después de la trefilación. Lo que sale de planta tiene trazabilidad hasta la colada de origen.',
    process: 'Control de proceso',
    lab: 'Laboratorio',
    certifications: 'Certificaciones',
    environment: 'Medio ambiente y energía',
  },
  company: {
    title: 'Empresa',
    lead: 'Fabricando hilo de aluminio en Irurtzun desde 1973.',
    history: 'Historia',
    group: 'Grupo',
    values: 'Cómo trabajamos',
    milestone: 'Hito',
  },
  contact: {
    title: 'Contacto',
    lead: 'Planta y oficinas en Irurtzun, Navarra. Atendemos consultas técnicas y comerciales en español, inglés y francés.',
    address: 'Dirección',
    phone: 'Teléfono',
    fax: 'Fax',
    email: 'Email',
    directions: 'Cómo llegar',
    openMap: 'Abrir en el mapa',
    commercial: 'Comercial',
    technical: 'Técnico',
  },
  footer: {
    rights: 'Todos los derechos reservados.',
    legal: 'Aviso legal',
    privacy: 'Privacidad',
    backToTop: 'Volver arriba',
    registered: 'Inscrita en el Registro Mercantil de Navarra.',
  },
  family: {
    metallizing: 'Metalización',
    welding: 'Soldadura',
    mechanical: 'Aplicaciones mecánicas',
    casting: 'Fundición',
    electrical: 'Aplicaciones eléctricas',
  },
  notFound: {
    title: 'Esta página no existe',
    lead: 'Puede que la hayamos movido o que el enlace esté mal.',
    cta: 'Ir al inicio',
  },
} as const

type Dictionary = {
  -readonly [K in keyof typeof es]: { -readonly [P in keyof (typeof es)[K]]: string }
}

const en: Dictionary = {
  nav: {
    home: 'Home',
    products: 'Products',
    quality: 'Quality',
    company: 'Company',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Close',
    skipToContent: 'Skip to content',
  },
  home: {
    productLines: 'Product lines',
    viewAllProducts: 'View all products',
    figures: 'Manfisa in figures',
    qualityTitle: 'Process control, cast by cast',
    qualityCta: 'How we control quality',
    companyCta: 'About the company',
    contactTitle: 'Need a specific alloy?',
    contactLead:
      'Tell us the application and the supply format you need. We reply with a technical proposal.',
    contactCta: 'Talk to the technical team',
  },
  products: {
    title: 'Products',
    lead: 'Drawn aluminium wire and alloys for metallizing, welding, mechanical applications and casting.',
    empty: 'No product lines published yet.',
    viewLine: 'View the line',
    family: 'Family',
  },
  line: {
    applications: 'Applications',
    alloys: 'Alloys',
    supply: 'Supply formats',
    downloads: 'Technical documentation',
    advice: 'Technical advice',
    adviceLead:
      'If your application does not fit any of the alloys in the table, we will look into it: much of what we make began as a customer specification.',
    backToProducts: 'Back to products',
    next: 'Next line',
    previous: 'Previous line',
    gallery: 'Images',
    alloy: 'Alloy',
    purity: 'Purity / composition',
    tensile: 'Tensile strength',
    elongation: 'Elongation',
    diameter: 'Diameters',
    format: 'Format',
    weight: 'Weight',
    packaging: 'Packaging',
    download: 'Download',
  },
  quality: {
    title: 'Quality',
    lead: 'Every coil is tested before, during and after drawing. Whatever leaves the plant is traceable back to the cast it came from.',
    process: 'Process control',
    lab: 'Laboratory',
    certifications: 'Certifications',
    environment: 'Environment and energy',
  },
  company: {
    title: 'Company',
    lead: 'Drawing aluminium wire in Irurtzun since 1973.',
    history: 'History',
    group: 'Group',
    values: 'How we work',
    milestone: 'Milestone',
  },
  contact: {
    title: 'Contact',
    lead: 'Plant and offices in Irurtzun, Navarre. We handle technical and commercial enquiries in Spanish, English and French.',
    address: 'Address',
    phone: 'Phone',
    fax: 'Fax',
    email: 'Email',
    directions: 'Getting here',
    openMap: 'Open in maps',
    commercial: 'Sales',
    technical: 'Technical',
  },
  footer: {
    rights: 'All rights reserved.',
    legal: 'Legal notice',
    privacy: 'Privacy',
    backToTop: 'Back to top',
    registered: 'Registered with the Commercial Registry of Navarre.',
  },
  family: {
    metallizing: 'Metallizing',
    welding: 'Welding',
    mechanical: 'Mechanical applications',
    casting: 'Casting',
    electrical: 'Electrical applications',
  },
  notFound: {
    title: 'This page does not exist',
    lead: 'We may have moved it, or the link may be broken.',
    cta: 'Go to homepage',
  },
}

const fr: Dictionary = {
  nav: {
    home: 'Accueil',
    products: 'Produits',
    quality: 'Qualité',
    company: 'Entreprise',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Fermer',
    skipToContent: 'Aller au contenu',
  },
  home: {
    productLines: 'Lignes de produits',
    viewAllProducts: 'Voir tous les produits',
    figures: 'Manfisa en chiffres',
    qualityTitle: 'Contrôle du procédé, coulée par coulée',
    qualityCta: 'Notre contrôle qualité',
    companyCta: 'Découvrir l’entreprise',
    contactTitle: 'Vous cherchez un alliage précis ?',
    contactLead:
      'Indiquez-nous l’application et le format de livraison souhaités. Nous répondons par une proposition technique.',
    contactCta: 'Contacter l’équipe technique',
  },
  products: {
    title: 'Produits',
    lead: 'Fil d’aluminium tréfilé et alliages pour la métallisation, le soudage, les applications mécaniques et la fonderie.',
    empty: 'Aucune ligne de produits publiée pour le moment.',
    viewLine: 'Voir la ligne',
    family: 'Famille',
  },
  line: {
    applications: 'Applications',
    alloys: 'Alliages',
    supply: 'Formats de livraison',
    downloads: 'Documentation technique',
    advice: 'Conseil technique',
    adviceLead:
      'Si votre application ne correspond à aucun alliage du tableau, nous l’étudions : une grande partie de notre gamme est née d’une spécification client.',
    backToProducts: 'Retour aux produits',
    next: 'Ligne suivante',
    previous: 'Ligne précédente',
    gallery: 'Images',
    alloy: 'Alliage',
    purity: 'Pureté / composition',
    tensile: 'Résistance',
    elongation: 'Allongement',
    diameter: 'Diamètres',
    format: 'Format',
    weight: 'Poids',
    packaging: 'Emballage',
    download: 'Télécharger',
  },
  quality: {
    title: 'Qualité',
    lead: 'Chaque bobine est contrôlée avant, pendant et après le tréfilage. Tout ce qui sort de l’usine est traçable jusqu’à sa coulée d’origine.',
    process: 'Contrôle du procédé',
    lab: 'Laboratoire',
    certifications: 'Certifications',
    environment: 'Environnement et énergie',
  },
  company: {
    title: 'Entreprise',
    lead: 'Tréfilage d’aluminium à Irurtzun depuis 1973.',
    history: 'Histoire',
    group: 'Groupe',
    values: 'Notre façon de travailler',
    milestone: 'Étape',
  },
  contact: {
    title: 'Contact',
    lead: 'Usine et bureaux à Irurtzun, Navarre. Nous traitons les demandes techniques et commerciales en espagnol, anglais et français.',
    address: 'Adresse',
    phone: 'Téléphone',
    fax: 'Fax',
    email: 'E-mail',
    directions: 'Nous trouver',
    openMap: 'Ouvrir dans le plan',
    commercial: 'Commercial',
    technical: 'Technique',
  },
  footer: {
    rights: 'Tous droits réservés.',
    legal: 'Mentions légales',
    privacy: 'Confidentialité',
    backToTop: 'Haut de page',
    registered: 'Immatriculée au Registre du commerce de Navarre.',
  },
  family: {
    metallizing: 'Métallisation',
    welding: 'Soudage',
    mechanical: 'Applications mécaniques',
    casting: 'Fonderie',
    electrical: 'Applications électriques',
  },
  notFound: {
    title: 'Cette page n’existe pas',
    lead: 'Nous l’avons peut-être déplacée, ou le lien est incorrect.',
    cta: 'Aller à l’accueil',
  },
}

const dictionaries: Record<Locale, Dictionary> = { es, en, fr }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export type { Dictionary }
