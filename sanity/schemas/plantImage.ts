import { defineField, defineType } from 'sanity'

/**
 * IMAGEN
 *
 * Se sube arrastrando el archivo, del tamaño que sea: Sanity guarda el original y su CDN
 * entrega a la web la versión ligera que hace falta en cada pantalla (formato, ancho y
 * recorte).
 *
 * El texto alternativo es obligatorio: es lo que oyen las personas que navegan con lector
 * de pantalla y lo que lee Google. Sin él, una foto es un hueco vacío.
 */
export const plantImage = defineType({
  name: 'plantImage',
  title: 'Imagen',
  type: 'object',
  fields: [
    defineField({
      name: 'asset',
      title: 'Archivo',
      type: 'image',
      options: {
        hotspot: true, // permite elegir el punto que nunca se recorta
      },
      validation: (rule) => rule.required(),
      description:
        'Arrastra la imagen. Puede pesar lo que sea: se optimiza automáticamente. ' +
        'El punto de interés (hotspot) marca qué parte no debe recortarse nunca.',
    }),
    defineField({
      name: 'alt',
      title: 'Descripción para accesibilidad',
      type: 'localizedString',
      validation: (rule) => rule.required(),
      description:
        'Describe lo que se ve, sin repetir el nombre del producto. ' +
        'Ejemplo: «Bobinas de hilo de 1,50 mm apiladas a la salida de la trefiladora».',
    }),
  ],
  preview: {
    select: { media: 'asset', title: 'alt.es' },
    prepare: ({ media, title }) => ({ media, title: title || 'Sin descripción' }),
  },
})
