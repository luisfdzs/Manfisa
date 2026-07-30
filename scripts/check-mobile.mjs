#!/usr/bin/env node
/**
 * VERIFICACIÓN EN MÓVIL · `npm run check:mobile`
 *
 * Abre el sitio en un Chrome real a 390×844 (tamaño de iPhone) y comprueba lo que en
 * escritorio no se ve. No es un test unitario: es la lista de cosas que en una web así se
 * rompen siempre, y cada comprobación está aquí porque el fallo correspondiente es invisible
 * a 1440 px de ancho.
 *
 * Lo que vigila, y por qué:
 *  1. **Desbordamiento horizontal.** En un catálogo industrial el sospechoso es la tabla de
 *     aleaciones: cinco columnas no caben en 390 px. Deben desplazarse DENTRO de su
 *     contenedor (`overflow-x:auto`), nunca arrastrando la página entera.
 *  2. **El menú móvil.** Que se abra, que tenga altura real (el `backdrop-blur` de la barra
 *     convierte al header en bloque contenedor de sus hijos `fixed`, y un panel mal colocado
 *     se queda en 0 px de alto), que bloquee el scroll y que se lea en grafito sobre claro.
 *  3. **Enlaces absolutos, medidos desde una ficha profunda.** Un `href()` relativo cuela
 *     desde la portada y encadena desde `/es/products/x` → 404.
 *  4. **Áreas pulsables de 24 px** (WCAG 2.2).
 *  5. **Los tres idiomas responden** y la etiqueta `lang` del documento coincide.
 *  6. **noindex fuera de producción**, para no competir con el dominio real en Google.
 *
 * Usa `playwright-core` con el Chrome ya instalado: no descarga navegadores. Requiere el
 * servidor levantado (`npm run dev`) o un despliegue:
 *
 *   npm run check:mobile                          → http://localhost:3000
 *   BASE=https://manfisatest.vercel.app npm run check:mobile
 */

import process from 'node:process'
import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'http://localhost:3000'
const LOCALE = process.env.LOCALE ?? 'es'
/** Dominio que SÍ debe indexarse. Fuera de él, se exige noindex. */
const PRODUCTION_HOST = 'www.manfisa.com'

/** Chrome instalado en el sistema. Se puede sobreescribir con CHROME_PATH. */
const CHROME =
  process.env.CHROME_PATH ??
  (process.platform === 'win32'
    ? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    : process.platform === 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : '/usr/bin/google-chrome')

const results = []
const check = (ok, label) => {
  results.push({ ok, label })
  console.log(`${ok ? '  ✓' : '  ✗'} ${label}`)
}

/** Ningún sitio debe desbordar horizontalmente en móvil. */
async function horizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
}

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()

  const errors = []
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  page.on('pageerror', (error) => errors.push(String(error)))

  console.log(`\nRevisión móvil (390×844) sobre ${BASE}/${LOCALE}\n`)

  // --- Portada ---------------------------------------------------------------
  await page.goto(`${BASE}/${LOCALE}`, { waitUntil: 'networkidle' })
  check((await horizontalOverflow(page)) <= 1, 'la portada no desborda en horizontal')

  const menuButton = page.locator('header button[aria-controls="mobile-nav"]')
  check(await menuButton.isVisible(), 'el botón de menú se ve en móvil')
  check(
    !(await page.locator('header nav[aria-label="Principal"]').first().isVisible()),
    'la navegación de escritorio está oculta',
  )

  // --- Menú: abrir, bloquear scroll, cerrar, navegar --------------------------
  await menuButton.click()
  const panel = page.locator('#mobile-nav')
  const opened = await panel
    .waitFor({ state: 'visible', timeout: 4000 })
    .then(() => true)
    .catch(() => false)
  check(opened, 'el panel del menú se abre y ocupa la pantalla')

  const panelBox = await panel.boundingBox()
  check(
    (panelBox?.height ?? 0) > 400,
    `el panel tiene altura real (${Math.round(panelBox?.height ?? 0)} px)`,
  )
  check(
    (await page.evaluate(() => document.body.style.overflow)) === 'hidden',
    'el scroll de la página se bloquea con el menú abierto',
  )

  // La barra deja de ir en color metal al abrir el menú (contraste sobre fondo claro).
  await page.waitForTimeout(700)
  const barColor = await page.evaluate(
    () => getComputedStyle(document.querySelector('.header-bar')).color,
  )
  check(barColor === 'rgb(20, 24, 27)', `la barra usa grafito con el menú abierto (${barColor})`)

  await page.keyboard.press('Escape')
  check(!(await panel.isVisible()), 'Escape cierra el menú')
  check(
    (await page.evaluate(() => document.body.style.overflow)) === '',
    'el scroll se restaura al cerrar',
  )

  await menuButton.click()
  await panel.locator('a').first().click()
  await page.waitForURL(`**/${LOCALE}/**`)
  check(!(await panel.isVisible()), 'el menú se cierra al navegar')
  check(
    (await page.evaluate(() => document.body.style.overflow)) === '',
    'el scroll queda desbloqueado tras navegar',
  )

  // --- Resto de plantillas ---------------------------------------------------
  for (const route of ['products', 'quality', 'company', 'contact']) {
    await page.goto(`${BASE}/${LOCALE}/${route}`, { waitUntil: 'networkidle' })
    check((await horizontalOverflow(page)) <= 1, `/${route} no desborda en horizontal`)
  }

  // --- Ficha de producto: el sitio donde vive la tabla ancha -------------------
  await page.goto(`${BASE}/${LOCALE}/products`, { waitUntil: 'networkidle' })
  const deep = await page.evaluate(
    () => document.querySelector('main a[href*="/products/"]')?.getAttribute('href') ?? null,
  )
  check(Boolean(deep), `hay fichas enlazadas desde /products (${deep ?? 'ninguna'})`)

  if (deep) {
    await page.goto(`${BASE}${deep}`, { waitUntil: 'networkidle' })
    check((await horizontalOverflow(page)) <= 1, 'la ficha de producto no desborda la PÁGINA')

    // La tabla sí puede ser más ancha que la pantalla — pero su desbordamiento tiene que
    // quedarse dentro de su propio contenedor. Es la comprobación que distingue «tabla
    // desplazable» de «web rota».
    const tables = await page.evaluate(() =>
      [...document.querySelectorAll('table.spec-table')].map((table) => {
        const box = table.parentElement
        return {
          wider: table.scrollWidth > box.clientWidth,
          scrollable: getComputedStyle(box).overflowX === 'auto',
        }
      }),
    )
    check(tables.length > 0, `la ficha tiene tablas técnicas (${tables.length})`)
    check(
      tables.every((table) => !table.wider || table.scrollable),
      'toda tabla más ancha que la pantalla está dentro de un contenedor desplazable',
    )

    // `href()` devolvía rutas relativas en el proyecto de referencia: desde la portada
    // colaban por casualidad y desde una ficha encadenaban → 404. Se mide aquí, que es
    // donde se notaba.
    const relatives = await page.evaluate(() =>
      [...document.querySelectorAll('header a, footer a')]
        .map((a) => a.getAttribute('href') ?? '')
        .filter((href) => href && !/^(\/|#|https?:|mailto:|tel:)/.test(href)),
    )
    check(
      relatives.length === 0,
      relatives.length === 0
        ? 'los enlaces de cabecera y pie son absolutos'
        : `enlaces relativos (encadenarán y darán 404): ${relatives.join(', ')}`,
    )
  }

  // --- Los tres idiomas responden y declaran su lang --------------------------
  for (const [locale, expected] of [
    ['es', 'es-ES'],
    ['en', 'en'],
    ['fr', 'fr'],
  ]) {
    const response = await page.goto(`${BASE}/${locale}`, { waitUntil: 'domcontentloaded' })
    const lang = await page.evaluate(() => document.documentElement.lang)
    check(
      response?.status() === 200 && lang === expected,
      `/${locale} responde 200 y declara lang="${lang}"`,
    )
  }

  // --- Áreas pulsables (WCAG 2.2: mínimo 24×24) -------------------------------
  await page.goto(`${BASE}/${LOCALE}`, { waitUntil: 'networkidle' })
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('a, button')]
      .map((element) => {
        const rect = element.getBoundingClientRect()
        const before = getComputedStyle(element, '::before')
        // La utilidad `tap` agranda el área con un pseudo-elemento invisible.
        const grow =
          before.content !== 'none' && before.position === 'absolute'
            ? Math.abs(Number.parseFloat(before.top) || 0) * 2
            : 0
        return {
          text: element.textContent.trim().slice(0, 30),
          height: rect.height + grow,
          width: rect.width,
        }
      })
      // El enlace "saltar al contenido" mide 1×1 mientras está oculto y crece al recibir
      // foco: es el patrón correcto, no un objetivo pequeño.
      .filter((element) => element.height > 2 && element.width > 2 && element.height < 24),
  )
  check(
    small.length === 0,
    small.length === 0
      ? 'todas las áreas pulsables llegan a 24 px'
      : `áreas pulsables por debajo de 24 px: ${JSON.stringify(small.slice(0, 5))}`,
  )

  // --- Indexación: sólo el dominio real puede aparecer en Google ---------------
  if (!BASE.includes(PRODUCTION_HOST)) {
    const robotsMeta = await page.evaluate(
      () => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '(ninguna)',
    )
    check(
      robotsMeta.includes('noindex'),
      `este entorno no es indexable (meta robots: ${robotsMeta})`,
    )
  }

  check(errors.length === 0, `sin errores de consola${errors.length ? `: ${errors[0]}` : ''}`)

  await browser.close()

  const failed = results.filter((result) => !result.ok)
  console.log(
    `\n${results.length - failed.length}/${results.length} comprobaciones correctas` +
      (failed.length ? ` — ${failed.length} fallo(s)\n` : '\n'),
  )
  process.exit(failed.length ? 1 : 0)
}

await main()
