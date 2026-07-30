import { defineField, defineType } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

/**
 * LÍNEA DE PRODUCTO (metalización, soldadura, aplicaciones mecánicas, fundición…)
 *
 * Es el único tipo de documento de catálogo. Una línea agrupa las **aleaciones** que se
 * fabrican para un uso y los **formatos de suministro** en que se entregan, porque así es
 * como pregunta el cliente: primero «para qué», después «qué aleación» y por último «en
 * qué bobina».
 *
 * Decisiones pensadas para quien edita:
 *
 * - **Las aleaciones son filas de una tabla, con columnas de verdad**, no un texto libre
 *   con guiones. Es lo que permite que la web las alinee por columnas y que mañana se
 *   puedan filtrar o comparar sin volver a teclear nada. La tentación de dejar un campo
 *   de texto rico aquí es exactamente lo que convierte un catálogo en un PDF.
 * - **La familia es una lista cerrada**: la web tiene la traducción preparada para cada
 *   valor en los tres idiomas, así que no se pueden inventar.
 * - El orden en la web se cambia **arrastrando** en el listado, no escribiendo números.
 * - La primera imagen de la galería es siempre la portada de la línea.
 */
export const productLine = defineType({
  name: 'productLine',
  title: 'Línea de producto',
  type: 'document',
  groups: [
    { name: 'ficha', title: 'Ficha', default: true },
    { name: 'textos', title: 'Textos' },
    { name: 'tecnico', title: 'Datos técnicos' },
    { name: 'imagenes', title: 'Imágenes' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la línea',
      type: 'localizedString',
      group: 'ficha',
      validation: (rule) => rule.required(),
      description: 'Ejemplo: «Hilo para metalización» / «Metallizing wire».',
    }),
    defineField({
      name: 'slug',
      title: 'Dirección en la web',
      type: 'slug',
      group: 'ficha',
      options: { source: 'title.en', maxLength: 60 },
      validation: (rule) => rule.required(),
      description:
        'Se genera del nombre en inglés al pulsar «Generate»: la URL es la misma en los ' +
        'tres idiomas (manfisa.com/es/products/…). Cambiarlo rompe los enlaces antiguos.',
    }),
    defineField({
      name: 'family',
      title: 'Familia',
      type: 'string',
      group: 'ficha',
      options: {
        list: [
          { title: 'Metalización', value: 'metallizing' },
          { title: 'Soldadura', value: 'welding' },
          { title: 'Aplicaciones mecánicas', value: 'mechanical' },
          { title: 'Fundición', value: 'casting' },
          { title: 'Aplicaciones eléctricas', value: 'electrical' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Mostrar en la portada',
      type: 'boolean',
      group: 'ficha',
      initialValue: true,
      description:
        'La portada muestra las líneas marcadas, en el orden del listado. La primera es ' +
        'la que abre la web a pantalla completa.',
    }),

    defineField({
      name: 'summary',
      title: 'Resumen',
      type: 'localizedString',
      group: 'textos',
      validation: (rule) => rule.required(),
      description: 'Una frase. Acompaña a la portada en el listado de productos.',
    }),
    defineField({
      name: 'body',
      title: 'Descripción',
      type: 'localizedParagraphs',
      group: 'textos',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'applications',
      title: 'Aplicaciones',
      type: 'localizedList',
      group: 'textos',
      validation: (rule) => rule.required(),
      description:
        'Para qué se usa, una por línea. Ejemplo: «Metalización de film de poliéster (PET)».',
    }),

    defineField({
      name: 'alloys',
      title: 'Aleaciones',
      type: 'array',
      group: 'tecnico',
      of: [
        {
          type: 'object',
          name: 'alloy',
          fields: [
            defineField({
              name: 'designation',
              title: 'Designación',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'No se traduce: es una referencia normalizada. Ejemplo: «EN AW-1080A».',
            }),
            defineField({
              name: 'purity',
              title: 'Pureza / composición',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'Ejemplo: «Al ≥ 99,80 %» o «Al-Si 5 %».',
            }),
            defineField({
              name: 'tensile',
              title: 'Resistencia a tracción',
              type: 'string',
              description: 'Opcional, con unidades. Ejemplo: «60-80 N/mm²».',
            }),
            defineField({
              name: 'elongation',
              title: 'Alargamiento',
              type: 'string',
              description: 'Opcional, con unidades. Ejemplo: «> 15 %».',
            }),
            defineField({
              name: 'diameters',
              title: 'Diámetros',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'Rango o lista, con unidades. Ejemplo: «1,00 – 3,00 mm».',
            }),
            defineField({
              name: 'note',
              title: 'Nota',
              type: 'localizedString',
              description: 'Opcional. Una aclaración corta que sí necesita traducción.',
            }),
          ],
          preview: {
            select: { title: 'designation', subtitle: 'purity' },
          },
        },
      ],
      description:
        'Una fila por aleación. Se pintan como tabla, con las cifras alineadas por ' +
        'columnas: rellena las mismas casillas en todas las filas para que se puedan comparar.',
    }),
    defineField({
      name: 'supply',
      title: 'Formatos de suministro',
      type: 'array',
      group: 'tecnico',
      of: [
        {
          type: 'object',
          name: 'supplyFormat',
          fields: [
            defineField({
              name: 'format',
              title: 'Formato',
              type: 'localizedString',
              validation: (rule) => rule.required(),
              description: 'Ejemplo: «Bobina de brida» / «Flanged spool».',
            }),
            defineField({
              name: 'weight',
              title: 'Peso',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'Con unidades. Ejemplo: «6,5 – 11 kg».',
            }),
            defineField({
              name: 'packaging',
              title: 'Embalaje',
              type: 'localizedString',
              validation: (rule) => rule.required(),
              description:
                'Ejemplo: «Caja de cartón corrugado sobre palé» / «Corrugated box on pallet».',
            }),
          ],
          preview: { select: { title: 'format.es', subtitle: 'weight' } },
        },
      ],
      description: 'Cómo se entrega. Si un formato es a medida, dilo en la descripción.',
    }),
    defineField({
      name: 'documents',
      title: 'Documentación técnica',
      type: 'array',
      group: 'tecnico',
      of: [
        {
          type: 'object',
          name: 'technicalDocument',
          fields: [
            defineField({
              name: 'label',
              title: 'Nombre del documento',
              type: 'localizedString',
              validation: (rule) => rule.required(),
              description: 'Ejemplo: «Ficha técnica» / «Technical data sheet».',
            }),
            defineField({
              name: 'file',
              title: 'Archivo (PDF)',
              type: 'file',
              options: { accept: '.pdf' },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'label.es' } },
        },
      ],
      description:
        'Fichas técnicas, fichas de seguridad y certificados. Se ofrecen como descarga ' +
        'directa: es lo primero que busca un cliente industrial.',
    }),

    defineField({
      name: 'images',
      title: 'Galería',
      type: 'array',
      of: [{ type: 'plantImage' }],
      group: 'imagenes',
      validation: (rule) => rule.required().min(1),
      description: 'La PRIMERA imagen es la portada de la línea. Arrastra para reordenar.',
    }),

    // Campo oculto que sostiene el orden por arrastre del listado.
    orderRankField({ type: 'productLine' }),
  ],
  preview: {
    select: { title: 'title.es', family: 'family', media: 'images.0.asset' },
    prepare: ({ title, family, media }) => ({ title, subtitle: family, media }),
  },
})
