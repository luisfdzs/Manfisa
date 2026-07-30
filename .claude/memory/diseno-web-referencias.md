---
name: diseno-web-referencias
description: Lenguaje visual «aluminio» — paleta, tipografía técnica con mono para las cifras, y por qué las tablas se diseñan como ficha impresa
metadata:
  type: project
---

Dirección: **aluminio**. Grises fríos de metal laminado, grafito para el texto y **un solo acento**
—azul acero— reservado a lo que hay que mirar. Sin degradados decorativos ni sombras: la web de un
fabricante de hilo de alta pureza tiene que leerse como **una ficha técnica bien impresa**, no como
una landing.

Todos los tokens viven en `app/globals.css`, en el `@theme`, **y sólo ahí**. Si un color o un
espaciado no está en esa lista, no se usa. Es lo que evita que la web se descuadre con el tiempo.

## Paleta

| Token                   | Valor     | Uso                                    |
| ----------------------- | --------- | -------------------------------------- |
| `--color-metal`         | `#f5f7f8` | fondo, aluminio muy claro (no blanco)  |
| `--color-metal-deep`    | `#e7ebee` | bloques alternos, huecos de imagen     |
| `--color-graphite`      | `#14181b` | texto principal                        |
| `--color-graphite-soft` | `#5c666d` | texto secundario                       |
| `--color-graphite-faint`| `#98a2a9` | metadatos, unidades, numeración        |
| `--color-line`          | `#d3d9dd` | filetes de 1 px                        |
| `--color-inverse`       | `#0d1114` | banda de cifras y pie                  |
| `--color-accent`        | `#12657f` | azul acero: enlaces y descargas        |

## Tipografía

**IBM Plex Sans** + **IBM Plex Mono**, autoalojadas por Next (`swap`, sin petición a Google), dos
pesos de cada una — cada peso extra es otra descarga que retrasa el primer texto.

**La mono no es decoración.** En una tabla de aleaciones las cifras tienen que alinearse por
columnas, y eso sólo lo garantiza un ancho fijo. Se usa en: celdas numéricas, designaciones de
aleación, etiquetas en versalitas (`eyebrow`), años de la cronología y las cifras de planta.

Escala fluida con `clamp()`, un solo valor por peldaño: `micro`, `small`, `body`, `lead`, `title`,
`display` y **`figure`** — un peldaño propio para las cifras de planta, porque a tamaño de titular
dejan de ser un dato y pasan a ser una declaración.

## Utilidades del sistema

`page-gutter`, `eyebrow`, `link-underline`, `tap` (área pulsable de 24 px sin cambiar el diseño),
`reveal` (aparición al scroll **sin JS**, con `animation-timeline: view()`) y **`spec-table`**.

### Por qué `spec-table` es una utilidad y no clases repetidas

Las reglas de una tabla técnica legible son fáciles de olvidar una por una: cifras en mono,
alineadas a la derecha, cabecera en versalitas, filete sólo entre filas. Repartidas por tres
componentes acaban divergiendo.

⚠️ **El `padding-right` de las celdas numéricas NO se pone a cero.** Se intentó, para que la última
columna quedara a ras del borde, y toda columna numérica **seguida de otra** se pegó a su vecina: se
leía «1,50 – 3,00 mmMáxima pureza» y la cabecera «PESOEMBALAJE». Alinear a la derecha acerca el
contenido al borde de la celda, así que ahí es donde más falta hace la separación. El borde limpio
se resuelve con `:last-child`, que es la única celda que de verdad no tiene vecina.

## Bloques con carácter

- **Hero** a pantalla completa con la portada de la primera línea destacada, y **dos velos** (ver
  [[arquitectura-web]] para por qué son dos).
- **Banda de cifras** sobre fondo `inverse`: el único bloque que interrumpe la lectura a propósito.
  En B2B la capacidad y los años de fábrica deciden si te piden muestra, y se leen de un vistazo o
  no se leen. Entre dos y seis cifras: menos y más grandes se leen mejor que una parrilla de doce.
- **Listas numeradas en mono** para aplicaciones, valores y puntos de control. El número es
  información: permite a un auditor referirse a «el paso 4».
- **Descargas** con el tipo y el **peso** del archivo a la vista, y `download` para que el navegador
  guarde en vez de abrir un visor. Sin `target="_blank"`: con `download` la pestaña se abriría y se
  cerraría sola.
- **Sin mapa incrustado** en Contacto: un iframe mete cookies de terceros en todas las visitas (y
  por tanto un banner de consentimiento) a cambio de una imagen que casi nadie usa. Se enlaza a
  OpenStreetMap y se aportan los datos estructurados de schema.org, generados **del mismo documento
  del panel** que el texto visible, así que no pueden divergir.

Relacionado: [[arquitectura-web]], [[encargo-y-competencia]].
