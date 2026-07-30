#!/usr/bin/env node
/**
 * IMÁGENES PROVISIONALES · `npm run placeholders`
 *
 * Genera una imagen por línea de producto para que la web pueda montarse y revisarse
 * **antes** de que Manfisa mande fotografía de planta. No son fotos: son planchas de color
 * aluminio con el nombre de la línea, y llevan escrito «IMAGEN PROVISIONAL» a propósito —
 * para que nadie las confunda con material definitivo ni acaben en producción por descuido.
 *
 * El esquema del panel exige al menos una imagen por línea (una ficha de producto sin
 * imagen no es una ficha), así que sin esto la migración inicial dejaría el catálogo entero
 * descartado por `lib/content.ts` y la web se vería vacía sin que estuviera roto nada.
 *
 * Cuando lleguen las fotos reales: se suben desde `/admin` sustituyendo cada imagen, y este
 * script y su carpeta se borran. No hay nada más que deshacer.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'
import { productLines } from './migration/content-snapshot.mjs'

const OUT_DIR = path.join(import.meta.dirname, 'migration', 'placeholders')
const WIDTH = 2400
const HEIGHT = 1350 // 16:9, la proporción con la que se recorta el hero

/** Un tono de gris frío distinto por familia, para distinguirlas de un vistazo en el panel. */
const TONES = {
  metallizing: ['#b9c4cb', '#7d8a93'],
  welding: ['#c3bfb6', '#87837a'],
  mechanical: ['#b5bcc0', '#7a8286'],
  casting: ['#c8bdb4', '#8a7f76'],
  electrical: ['#b0bcc4', '#75828a'],
}

function svg(title, family) {
  const [from, to] = TONES[family] ?? TONES.metallizing
  // El texto va en el SVG y no compuesto aparte porque así se escala solo con el lienzo.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)"/>
  <g fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2">
    ${
      // Anillos concéntricos: la sección de una bobina de hilo, que es lo que se fabrica.
      Array.from(
        { length: 22 },
        (_, i) => `<circle cx="${WIDTH * 0.72}" cy="${HEIGHT * 0.5}" r="${40 + i * 28}"/>`,
      ).join('\n    ')
    }
  </g>
  <text x="120" y="${HEIGHT - 190}" font-family="sans-serif" font-size="34" letter-spacing="6"
        fill="#0d1114" fill-opacity="0.55">IMAGEN PROVISIONAL</text>
  <text x="120" y="${HEIGHT - 110}" font-family="sans-serif" font-size="76" font-weight="600"
        fill="#0d1114" fill-opacity="0.8">${title}</text>
</svg>`
}

await mkdir(OUT_DIR, { recursive: true })

for (const line of productLines) {
  const file = path.join(OUT_DIR, `${line.slug}.jpg`)
  const buffer = await sharp(Buffer.from(svg(line.title.es, line.family)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
  await writeFile(file, buffer)
  console.log(`  ✓ ${path.relative(process.cwd(), file)}`)
}

console.log(
  `\n${productLines.length} imágenes provisionales generadas en ${path.relative(process.cwd(), OUT_DIR)}\n`,
)
