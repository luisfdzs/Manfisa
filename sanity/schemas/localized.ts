import { defineField, defineType } from 'sanity'

/**
 * BLOQUES TRILINGÜES
 *
 * En lugar de un sistema de traducción con documentos paralelos, cada campo de texto es
 * un objeto con "Español", "Inglés" y "Francés" al lado. Para tres idiomas sigue siendo
 * lo más claro para quien edita: se ve de un golpe qué falta traducir, sin cambiar de
 * documento ni de pestaña.
 *
 * Con tres columnas el formulario se estrecha, así que los textos largos van apilados
 * (`columns` sólo en los cortos): una caja de tres líneas repartida en tres columnas no
 * se puede escribir.
 */

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Texto',
  type: 'object',
  options: { columns: 3 },
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'en', title: 'Inglés', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'fr', title: 'Francés', type: 'string', validation: (r) => r.required() }),
  ],
})

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Texto largo',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'en',
      title: 'Inglés',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'fr',
      title: 'Francés',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
})

/**
 * Varios párrafos. Se guarda como lista de párrafos (no como texto rico) porque el
 * diseño sólo admite párrafos: así nadie puede meter un titular gigante, una tabla a
 * mano o un color que rompa la estética. Las tablas técnicas tienen su propio campo,
 * con columnas de verdad.
 */
export const localizedParagraphs = defineType({
  name: 'localizedParagraphs',
  title: 'Párrafos',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      validation: (r) => r.required().min(1),
      description: 'Un elemento por párrafo. Se muestran en este orden.',
    }),
    defineField({
      name: 'en',
      title: 'Inglés',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      validation: (r) => r.required().min(1),
      description: 'Un elemento por párrafo, en el mismo orden que el español.',
    }),
    defineField({
      name: 'fr',
      title: 'Francés',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      validation: (r) => r.required().min(1),
      description: 'Un elemento por párrafo, en el mismo orden que el español.',
    }),
  ],
})

/**
 * Lista corta de frases: aplicaciones de una línea de producto, puntos de control de
 * calidad, valores. Es un array de textos de una línea, no párrafos: se pintan como
 * lista y no como prosa.
 */
export const localizedList = defineType({
  name: 'localizedList',
  title: 'Lista',
  type: 'object',
  fields: [
    defineField({
      name: 'es',
      title: 'Español',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required().min(1),
      description: 'Un elemento por línea.',
    }),
    defineField({
      name: 'en',
      title: 'Inglés',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required().min(1),
      description: 'Un elemento por línea, en el mismo orden que el español.',
    }),
    defineField({
      name: 'fr',
      title: 'Francés',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required().min(1),
      description: 'Un elemento por línea, en el mismo orden que el español.',
    }),
  ],
})
