#!/usr/bin/env node
/**
 * ASSETS DE MARCA · `npm run brand`
 *
 * Genera los tres ficheros que Next sirve por convención desde `app/`:
 *
 *   app/icon.png             → favicon (512 px)
 *   app/apple-icon.png       → icono de pantalla de inicio en iOS (180 px)
 *   app/opengraph-image.jpg  → imagen al compartir en WhatsApp, LinkedIn, Slack (1200×630)
 *
 * Se generan del **mismo** dibujo que usa `components/layout/Wordmark.tsx` —la sección de una
 * bobina de hilo— para que la marca no diverja entre la cabecera y la pestaña del navegador.
 * Ese dibujo está declarado abajo una sola vez, en `COIL`.
 *
 * ⚠️ **PROVISIONAL**, igual que el wordmark: cuando exista el logotipo oficial vectorizado, se
 * sustituye `COIL` por sus trazos y se vuelve a ejecutar este script. Nada más cambia.
 *
 * Sin estos ficheros el navegador pide `/favicon.ico` en cada carga y recibe un 404 — que es
 * ruido en la consola en desarrollo y una pestaña sin identidad en producción. Lo detectó
 * `npm run check:mobile`, en la comprobación de errores de consola.
 */

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

const APP_DIR = path.join(import.meta.dirname, '..', 'app')

/** Tokens de color, los mismos que `app/globals.css`. Aquí no se pueden leer de CSS, así que
 *  se repiten — si cambian allí, cambian aquí. Es el único sitio donde se duplican. */
const GRAPHITE = '#14181b'
const METAL = '#f5f7f8'

/** La bobina, en un lienzo de 24×24 como en el wordmark. `scale` la lleva al tamaño pedido. */
const COIL = (size, stroke, color) => {
  const s = size / 24
  return [10.2, 6.4, 2.6]
    .map(
      (r) =>
        `<circle cx="${12 * s}" cy="${12 * s}" r="${r * s}" fill="none" stroke="${color}" stroke-width="${stroke}"/>`,
    )
    .join('')
}

/** Icono cuadrado: bobina en color metal sobre grafito. Legible a 16 px, que es el tamaño real
 *  al que se ve un favicon en una pestaña. */
function iconSvg(size) {
  const inner = size * 0.62
  const offset = (size - inner) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.16}" fill="${GRAPHITE}"/>
  <g transform="translate(${offset} ${offset})">${COIL(inner, Math.max(2, size * 0.035), METAL)}</g>
</svg>`
}

/** Imagen de compartir: marca a la izquierda, bobina grande recortada a la derecha. Sin foto,
 *  porque una foto de planta que no tenemos no se puede inventar aquí. */
function openGraphSvg() {
  const [W, H] = [1200, 630]
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${GRAPHITE}"/>
  <g opacity="0.22" transform="translate(760 -60)">${COIL(760, 3, METAL)}</g>
  <g transform="translate(88 250)">${COIL(56, 3.6, METAL)}</g>
  <text x="164" y="292" font-family="sans-serif" font-size="46" font-weight="600"
        letter-spacing="10" fill="${METAL}">MANFISA</text>
  <text x="88" y="374" font-family="sans-serif" font-size="30" fill="${METAL}" fill-opacity="0.72">
    Hilo de aluminio de alta pureza · Irurtzun, Navarra
  </text>
  <text x="88" y="418" font-family="sans-serif" font-size="30" fill="${METAL}" fill-opacity="0.72">
    Metalización · Soldadura · Fundición
  </text>
</svg>`
}

await mkdir(APP_DIR, { recursive: true })

const outputs = [
  [
    'icon.png',
    await sharp(Buffer.from(iconSvg(512)))
      .png()
      .toBuffer(),
  ],
  [
    'apple-icon.png',
    await sharp(Buffer.from(iconSvg(180)))
      .png()
      .toBuffer(),
  ],
  [
    'opengraph-image.jpg',
    await sharp(Buffer.from(openGraphSvg())).jpeg({ quality: 88, mozjpeg: true }).toBuffer(),
  ],
]

for (const [name, buffer] of outputs) {
  const file = path.join(APP_DIR, name)
  await writeFile(file, buffer)
  console.log(`  ✓ ${path.relative(process.cwd(), file)} (${Math.round(buffer.length / 1024)} kB)`)
}

console.log('\nAssets de marca generados. Recuerda que son PROVISIONALES.\n')
