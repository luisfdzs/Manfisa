import type { SchemaTypeDefinition } from 'sanity'
import { companyInfo } from './companyInfo'
import { localizedList, localizedParagraphs, localizedString, localizedText } from './localized'
import { plantImage } from './plantImage'
import { productLine } from './productLine'
import { qualityInfo } from './qualityInfo'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documentos
  productLine,
  companyInfo,
  qualityInfo,
  // Piezas reutilizables
  plantImage,
  localizedString,
  localizedText,
  localizedParagraphs,
  localizedList,
]
