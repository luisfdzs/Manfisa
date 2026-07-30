#!/usr/bin/env node
/**
 * DESCARGA Y PREPARACIÓN DE IMÁGENES · `npm run images`
 *
 * Trae de manfisa.com las fotografías declaradas en `source-images.mjs` y las deja listas
 * para subir a Sanity, en `scripts/migration/media/` (gitignorado).
 *
 * Qué hace y por qué:
 *
 * - **Convierte a WebP** con calidad 82. La CDN de Sanity volverá a transformarlas para cada
 *   pantalla, así que aquí sólo interesa quitar el peso muerto del JPEG original sin tocar la
 *   resolución útil.
 * - **Nunca amplía.** `withoutEnlargement` es deliberado: varias fotos de formato sólo existen
 *   a 329 px en su web, y escalarlas a 2400 px no añade un solo detalle — sólo peso y una
 *   nitidez falsa. Se suben tal cual y el diseño las coloca donde no se noten (ver la nota
 *   sobre portadas en `source-images.mjs`).
 * - **Recorta el ancho a 2400 px**, que es la variante mayor que sirve `next/image` aquí.
 *
 * Es idempotente: se puede repetir sin efectos raros.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'
import { ALL_FILES, BASE, slugify } from './source-images.mjs'

const OUT = path.join(import.meta.dirname, 'migration', 'media')
const MAX_WIDTH = 2400

await mkdir(OUT, { recursive: true })

let ok = 0
const small = []

for (const file of ALL_FILES) {
  const url = `${BASE}/${file}`
  const response = await fetch(url, { headers: { 'User-Agent': 'manfisa-site-build/1.0' } })
  if (!response.ok) {
    console.error(`  ✗ ${file} -> HTTP ${response.status}`)
    continue
  }
  const original = Buffer.from(await response.arrayBuffer())
  const { width = 0, height = 0 } = await sharp(original).metadata()

  const processed = await sharp(original)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer()

  const name = `${slugify(file)}.webp`
  await writeFile(path.join(OUT, name), processed)
  ok++

  const flag = width < 800 ? '  ⚠ pequeña' : ''
  if (width < 800) small.push(`${name} (${width}×${height})`)
  console.log(
    `  ✓ ${name.padEnd(38)} ${String(width).padStart(4)}×${String(height).padEnd(4)} ` +
      `${Math.round(processed.length / 1024)} kB${flag}`,
  )
}

console.log(`\n${ok}/${ALL_FILES.length} imágenes en ${path.relative(process.cwd(), OUT)}`)
if (small.length) {
  console.log(
    `\n⚠ ${small.length} por debajo de 800 px de ancho. Es el original que publica manfisa.com,\n` +
      `  no un fallo del script: por eso ninguna se usa como portada.\n  ${small.join('\n  ')}`,
  )
}
