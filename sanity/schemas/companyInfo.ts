import { defineField, defineType } from 'sanity'

/**
 * EMPRESA Y CONTACTO (documento único)
 *
 * Todo lo que no es catálogo ni calidad: el posicionamiento que abre la web, las cifras
 * de planta, la historia, el grupo y los datos de contacto. Es un documento único
 * (singleton): no se puede crear un segundo, para que no haya dudas de cuál manda.
 *
 * Los datos de contacto están aquí y no en el código a propósito: un teléfono o una
 * dirección cambian, y cuando cambian nadie quiere abrir un repositorio.
 */
export const companyInfo = defineType({
  name: 'companyInfo',
  title: 'Empresa y contacto',
  type: 'document',
  groups: [
    { name: 'textos', title: 'Textos', default: true },
    { name: 'portada', title: 'Mosaico de portada' },
    { name: 'cifras', title: 'Cifras' },
    { name: 'historia', title: 'Historia y grupo' },
    { name: 'contacto', title: 'Contacto' },
  ],
  fields: [
    defineField({
      name: 'claim',
      title: 'Titular de portada',
      type: 'localizedString',
      group: 'textos',
      validation: (rule) => rule.required(),
      description:
        'La frase grande que abre la web, sobre la foto. Corta: en móvil no caben más ' +
        'de ocho o nueve palabras sin partirse en cinco líneas.',
    }),

    defineField({
      name: 'heroMontage',
      title: 'Imágenes del mosaico',
      type: 'array',
      of: [{ type: 'plantImage' }],
      group: 'portada',
      validation: (rule) => rule.required().min(3).max(8),
      description:
        'Lo primero que se ve al abrir la web: un mosaico de fotos con movimiento lento. ' +
        'Entre tres y ocho. La PRIMERA ocupa la pieza grande y es la que más se ve, así que ' +
        'conviene que sea la más potente y la de mayor resolución; las demás rellenan las ' +
        'piezas pequeñas. Funciona mejor con fotos de textura (hilo o bobina de cerca) que ' +
        'con bodegones sobre fondo blanco, que en el mosaico se ven como manchas claras.',
    }),

    defineField({
      name: 'statement',
      title: 'Descripción de la empresa',
      type: 'localizedParagraphs',
      group: 'textos',
      validation: (rule) => rule.required(),
      description:
        'Los párrafos que describen a Manfisa. El PRIMERO se usa también en la portada; ' +
        'la página Empresa muestra todos.',
    }),
    defineField({
      name: 'values',
      title: 'Cómo trabajamos',
      type: 'localizedList',
      group: 'textos',
      validation: (rule) => rule.required(),
      description: 'Una idea por línea. Aparecen en la página Empresa.',
    }),

    defineField({
      name: 'figures',
      title: 'Manfisa en cifras',
      type: 'array',
      group: 'cifras',
      of: [
        {
          type: 'object',
          name: 'figure',
          fields: [
            defineField({
              name: 'value',
              title: 'Cifra',
              type: 'string',
              validation: (rule) => rule.required(),
              description:
                'Ya formateada, con su unidad si la lleva. Ejemplo: «1973», «3.500 t/año», «> 30 M€».',
            }),
            defineField({
              name: 'label',
              title: 'Qué mide',
              type: 'localizedString',
              validation: (rule) => rule.required(),
              description: 'Ejemplo: «Capacidad instalada» / «Installed capacity».',
            }),
          ],
          preview: { select: { title: 'value', subtitle: 'label.es' } },
        },
      ],
      validation: (rule) => rule.required().min(2).max(6),
      description:
        'Entre dos y seis. Son el argumento comercial de la portada, así que menos y ' +
        'más grandes se leen mejor que una parrilla de doce.',
    }),

    defineField({
      name: 'milestones',
      title: 'Historia',
      type: 'array',
      group: 'historia',
      of: [
        {
          type: 'object',
          name: 'milestone',
          fields: [
            defineField({
              name: 'year',
              title: 'Año',
              type: 'string',
              validation: (rule) => rule.required(),
              description: 'Ejemplo: «1973». Puede ser un rango: «2019-2021».',
            }),
            defineField({
              name: 'text',
              title: 'Qué pasó',
              type: 'localizedString',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'year', subtitle: 'text.es' } },
        },
      ],
      description: 'En orden cronológico. Arrastra para cambiarlo.',
    }),
    defineField({
      name: 'group',
      title: 'Empresas del grupo',
      type: 'array',
      group: 'historia',
      of: [
        {
          type: 'object',
          name: 'groupCompany',
          fields: [
            defineField({
              name: 'name',
              title: 'Nombre',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'activity',
              title: 'Actividad',
              type: 'localizedString',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'url', title: 'Web', type: 'url' }),
          ],
          preview: { select: { title: 'name', subtitle: 'activity.es' } },
        },
      ],
      description: 'Sociedades del holding. Se listan en la página Empresa.',
    }),

    defineField({
      name: 'street',
      title: 'Dirección',
      type: 'string',
      group: 'contacto',
      validation: (rule) => rule.required(),
      description: 'Calle y número. Ejemplo: «Carretera Estella, 40».',
    }),
    defineField({
      name: 'postalCode',
      title: 'Código postal',
      type: 'string',
      group: 'contacto',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'Localidad',
      type: 'string',
      group: 'contacto',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Provincia / región',
      type: 'localizedString',
      group: 'contacto',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'País',
      type: 'localizedString',
      group: 'contacto',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
      group: 'contacto',
      validation: (rule) => rule.required(),
      description: 'Con prefijo internacional. Ejemplo: «+34 948 500 206».',
    }),
    defineField({
      name: 'fax',
      title: 'Fax',
      type: 'string',
      group: 'contacto',
      description: 'Opcional. Sigue existiendo en pedidos industriales.',
    }),
    defineField({
      name: 'email',
      title: 'Email de contacto',
      type: 'string',
      group: 'contacto',
      validation: (rule) => rule.required().email(),
      description: 'Aparece en el pie de todas las páginas y en Contacto.',
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordenadas de la planta',
      type: 'geopoint',
      group: 'contacto',
      description:
        'Se usan para el enlace «Abrir en el mapa» y para los datos estructurados que lee ' +
        'Google. No se incrusta ningún mapa: cargarlo metería cookies de terceros en ' +
        'todas las visitas por una imagen que casi nadie mira.',
    }),
    defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url', group: 'contacto' }),
  ],
  preview: { prepare: () => ({ title: 'Empresa y contacto' }) },
})
