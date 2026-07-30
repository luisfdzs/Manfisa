import { defineField, defineType } from 'sanity'

/**
 * CALIDAD (documento único)
 *
 * En este sector la página de calidad no es relleno: es la que decide si un cliente pide
 * muestra. Va en su propio documento para que quien la mantiene —normalmente calidad, no
 * marketing— no tenga que abrir el formulario de la empresa entera.
 */
export const qualityInfo = defineType({
  name: 'qualityInfo',
  title: 'Calidad',
  type: 'document',
  groups: [
    { name: 'proceso', title: 'Proceso y laboratorio', default: true },
    { name: 'certificaciones', title: 'Certificaciones' },
    { name: 'medioambiente', title: 'Medio ambiente' },
  ],
  fields: [
    defineField({
      name: 'intro',
      title: 'Introducción',
      type: 'localizedParagraphs',
      group: 'proceso',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'controls',
      title: 'Puntos de control',
      type: 'array',
      group: 'proceso',
      of: [
        {
          type: 'object',
          name: 'control',
          fields: [
            defineField({
              name: 'stage',
              title: 'Etapa',
              type: 'localizedString',
              validation: (rule) => rule.required(),
              description: 'Ejemplo: «Recepción de materia prima» / «Raw material intake».',
            }),
            defineField({
              name: 'text',
              title: 'Qué se comprueba',
              type: 'localizedString',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'stage.es', subtitle: 'text.es' } },
        },
      ],
      validation: (rule) => rule.required().min(1),
      description:
        'En el orden real del proceso: de la materia prima al embalaje. Se pintan ' +
        'numerados, así que el orden es información.',
    }),
    defineField({
      name: 'lab',
      title: 'Laboratorio',
      type: 'localizedParagraphs',
      group: 'proceso',
      validation: (rule) => rule.required(),
      description: 'Equipos y ensayos propios: espectrometría, tracción, medición en continuo.',
    }),

    defineField({
      name: 'certifications',
      title: 'Certificaciones',
      type: 'array',
      group: 'certificaciones',
      of: [
        {
          type: 'object',
          name: 'certification',
          fields: [
            defineField({
              name: 'name',
              title: 'Nombre',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'No se traduce: es la referencia de la norma. Ejemplo: «ISO 9001:2015».',
            }),
            defineField({
              name: 'scope',
              title: 'Alcance',
              type: 'localizedString',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'body', title: 'Entidad certificadora', type: 'string' }),
            defineField({
              name: 'file',
              title: 'Certificado (PDF)',
              type: 'file',
              options: { accept: '.pdf' },
              description: 'Opcional. Si se sube, la web lo ofrece como descarga.',
            }),
          ],
          preview: { select: { title: 'name', subtitle: 'scope.es' } },
        },
      ],
      description:
        'Sólo certificaciones vigentes y verificables. Si una caduca, se quita: en una ' +
        'auditoría de cliente, una certificación caducada en la web pesa más que no tenerla.',
    }),

    defineField({
      name: 'environment',
      title: 'Medio ambiente y energía',
      type: 'localizedParagraphs',
      group: 'medioambiente',
      validation: (rule) => rule.required(),
      description:
        'Energía de origen renovable, autoconsumo fotovoltaico, gestión de residuos y ' +
        'reciclado del aluminio.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Calidad' }) },
})
