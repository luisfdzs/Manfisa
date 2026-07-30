---
name: imagenes-y-hero
description: De dónde salen las fotos (todas de manfisa.com), por qué se descartó el stock libre, la limitación de resolución del material, y por qué el hero se mueve con CSS y no con vídeo
metadata:
  type: project
---

## De dónde salen las fotos

**Todas de manfisa.com.** Son fotografías propias de la casa: producto real, sin duda de licencia
ni de verosimilitud. `scripts/source-images.mjs` declara qué foto va en cada sitio y con qué texto
alternativo en los tres idiomas; `npm run images` las descarga y las pasa a WebP; la migración las
sube a Sanity.

Los binarios **no se versionan**: se regeneran. El repositorio no engorda con material que ya vive
en manfisa.com y en la CDN de Sanity.

## Por qué NO se usó stock libre (se buscó, y se descartó)

- **Wikimedia Commons y Openverse**: se consultaron por API filtrando por licencia. Lo relevante
  (plantas de aluminio, tréfileuses) estaba en **CC BY-SA**, que impone atribución visible y
  *share-alike* sobre los recortes. En una web corporativa eso es una obligación permanente a
  cambio de una foto de relleno. La mayoría del resto era material histórico sin relación.
- **Unsplash y Pexels**: su licencia sí permite uso comercial **sin atribución** —legalmente son
  mejor opción que CC BY-SA para esto— pero **exigen clave de API**. `unsplash.com/napi/...`
  responde `Authorization required` y las páginas de búsqueda se pintan con JavaScript.

Conclusión: con el material propio cubriendo el catálogo entero, meter stock sólo añadía
obligaciones. Si algún día hace falta ambiente de planta, la vía limpia es una clave de Unsplash.

## ⚠️ Limitación real del material

Varias fotos de formato (`rollos_*`, `rosaceas_*`, `fundicion_*`) **sólo existen a 329×168 px** en
manfisa.com. No es un fallo del pipeline: es el original que publican. Consecuencias, y conviene no
deshacerlas sin tener fotos mejores:

1. **Ninguna imagen pequeña se usa como portada.** Las portadas salen siempre de las grandes
   (`slider_oa`, `k44_cesta_metalica`, `slider_soldadura`, `Granalla`, `slider_home_bobinas`).
2. **La galería de la ficha va a tres columnas**, no a dos: a un tercio de ancho no se amplían.
3. `fetch-images.mjs` usa `withoutEnlargement` y **avisa por consola** de cuáles son pequeñas.
   Escalar a 2400 px no añadiría un detalle: sólo peso y nitidez falsa.

También se descartó `cabecera_slider_port_carpeta.jpg` para el mosaico pese a ser una textura
preciosa: lleva **el logotipo «manfisa» incrustado en el pixel** y en una pieza del mosaico sale
cortado a media palabra, con pinta de error de maquetación.

## El hero es un MURO EN MOVIMIENTO (y el primer intento estaba mal)

⚠️ **Error a no repetir:** el primer hero se construyó «como sanity.io» **sin haber mirado
sanity.io**. Salió un mosaico de cinco piezas fijas con un zoom tan lento que no se percibía, y
encima oscurecido al 45 %: un collage apagado. El usuario lo dijo directamente — «no se ve para nada
como en sanity.io» — y tenía razón.

Lo que hace de verdad ese hero es **desplazar continuamente decenas de paneles distintos**, a
velocidades distintas, unos entrando y otros saliendo del encuadre. La versión actual reproduce eso:

- **Seis columnas** (cuatro en tablet, dos en móvil), cada una con su velocidad (68-118 s) y
  **sentidos alternos**. Si todas se movieran igual, el ojo lo lee como una sola imagen
  desplazándose.
- **Bucle sin costura**: cada columna repite su contenido dos veces y se desplaza un 50 % exacto, así
  que el último fotograma es idéntico al primero. Sin eso se ve el salto y se cae todo el efecto.
- **Relleno mínimo por columna** (`MIN_PANELS_PER_COLUMN = 5`): con doce fotos entre seis columnas
  tocaban a dos y la columna se quedaba sin paneles a media pasada — aparecía un vacío negro abajo a
  la derecha.
- **Rotación −8° y escala 1,42**: al rotar quedan triángulos sin cubrir en dos esquinas; la escala
  tiene que sobredimensionar lo bastante para sangrar por los cuatro lados. Con 1,18 se veía el hueco.
- **Velo LATERAL, no general**: denso a la izquierda (donde va el texto) y transparente a la derecha
  (donde el muro debe lucir). Oscurecer en bloque fue lo que apagó la primera versión. Se probó además
  bajar el brillo de los paneles y **empeoró**: los bodegones sobre fondo blanco pasaban de parche
  luminoso a mancha gris.

## El hero se mueve con CSS, no con vídeo

Se pidió expresamente un hero tipo sanity.io, «mezcla de imágenes y vídeos», con la opción de
apoyarse en un servicio de imagen-a-vídeo. Se resolvió con **CSS**, y las razones importan:

- **Peso y LCP.** Un hero en vídeo son megabytes que compiten con la imagen más grande de la
  página. El zoom lento (`montage-tile` en `globals.css`) va sobre imágenes que hay que descargar
  igualmente: mismo efecto percibido, **cero bytes añadidos**.
- **Autoplay en móvil** es un campo de minas (ahorro de datos, políticas del navegador).
- **Editable.** Al ser imágenes, el mosaico se cambia desde el panel («Empresa y contacto› Mosaico
  de portada», campo `heroMontage`, de 3 a 8 imágenes). Un vídeo habría que volver a renderizarlo
  fuera y subirlo.
- **Sin terceros.** Un servicio de imagen-a-vídeo obliga a subir los originales de Manfisa a una
  plataforma externa y normalmente a abrir cuenta.
- No hay **ffmpeg** en la máquina, así que un vídeo local tampoco era inmediato.

Detalles: `alternate` en la animación evita el salto al reiniciar (que es lo que delata un bucle);
cada pieza tiene su propio `--drift` y su retardo para que el conjunto no lata al unísono; y se
respeta `prefers-reduced-motion`.

Relacionado: [[diseno-web-referencias]], [[arquitectura-web]], [[panel-administracion]],
[[pendientes-manfisa]].
