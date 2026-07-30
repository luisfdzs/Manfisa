import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

/**
 * MENÚ DEL PANEL
 *
 * Se define a mano en vez de dejar el listado automático de Sanity por dos razones:
 *
 * 1. **Ordenar arrastrando.** `orderableDocumentListDeskItem` da un listado donde el
 *    orden de la web se cambia arrastrando las fichas, sin números de por medio.
 * 2. **Los singletons se abren en su formulario**, no en un listado con un solo elemento
 *    ni con la opción de crear un segundo.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Contenido')
    .items([
      orderableDocumentListDeskItem({
        type: 'productLine',
        title: 'Líneas de producto',
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('Calidad')
        .id('qualityInfo')
        .child(S.document().schemaType('qualityInfo').documentId('qualityInfo')),
      S.listItem()
        .title('Empresa y contacto')
        .id('companyInfo')
        .child(S.document().schemaType('companyInfo').documentId('companyInfo')),
    ])
