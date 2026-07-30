---
name: encargo-y-competencia
description: De dónde sale el proyecto — Electrolead como referencia competitiva y las decisiones de producto que salieron de compararse con ella
metadata:
  type: project
---

El encargo fue: «una web para un negocio que es **competencia directa de
https://www.electrolead.co.in/**, usando el stack, arquitectura y metodología de
`C:\Proyectos\sangilstudio` (rama test)».

## Quién es Electrolead

**Electrolead Pune Pvt. Ltd** — fabricante indio de hilo de aluminio de alta pureza en la zona
industrial de Chakan (Pune, Maharashtra). Capacidad declarada **3.500 t/año**. Vende hilo y
varilla de alta pureza para **metalización** de film de poliéster, BOPP y papel, más condensadores
y un producto de nicho («tea bag wire»). Publica una tabla con **1080 (≥ 99,80 %), 1090
(≥ 99,90 %) y 1199 (≥ 99,99 %)**, con resistencia, alargamiento y diámetro desde 1,50 mm, y
ofrece ficha técnica, ficha de seguridad y certificado de contacto alimentario en descarga. Su
web tiene cinco páginas: Home, Products, Quality, About Us, Contact.

## Por qué el negocio elegido es Manfisa

Manfisa **es** ese competidor directo, y en metalización es el proveedor de referencia mundial —
la misma línea de producto, el mismo mercado. Así que el proyecto no consistió en inventar una
empresa, sino en rehacer la web de Manfisa con el stack y la metodología de SANGIL STUDIO. Lo
confirmó el usuario al arrancar, junto con **tres idiomas (es/en/fr)** y montar Sanity y Vercel
desde el primer día.

## Decisiones de producto que salieron de compararse con Electrolead

Son las que dan ventaja competitiva, y conviene no perderlas al rediseñar:

- **Las tablas de aleaciones son datos estructurados, no texto.** Electrolead las publica como
  prosa. Aquí son filas con columnas (designación, pureza, resistencia, alargamiento, diámetros),
  así que se alinean por columnas, se comparan de un vistazo y mañana se pueden filtrar.
- **Cinco líneas frente a una.** Electrolead sólo cubre metalización. La web se organiza por
  **familia de uso** (metalización, soldadura, mecánicas, fundición, eléctricas) porque el cliente
  no busca «una aleación», busca «algo para metalizar».
- **Descargas de PDF con tipo y peso a la vista.** Es lo primero que busca un cliente industrial,
  y es lo que Electrolead sí hace bien: se ha igualado y se ha añadido el peso del archivo.
- **Empresa y Calidad son páginas, no anclas de la portada** (a diferencia de SANGIL STUDIO, donde
  estudio y contacto son secciones del inicio). En B2B son las URLs que se citan en pliegos y
  auditorías de proveedor, y una ancla no se puede citar.
- **Formatos de suministro como tabla propia** (bobina, peso, embalaje). Electrolead los menciona
  de pasada en Quality; es información de pedido y merece su sitio.

Relacionado: [[identidad-manfisa]], [[arquitectura-web]], [[diseno-web-referencias]].
